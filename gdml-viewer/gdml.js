// GDML reader: turns GDML text into a plain description of the geometry
// (defines, solids, volumes, the world), following what Geant4's G4GDMLRead* classes do.
// Nothing here touches the page or three.js, so it can be read and tested on its own.
//
// Units: lengths in mm, angles in rad, as in Geant4.

const UNITS = {
  // length
  nm: 1e-6, um: 1e-3, mum: 1e-3, mm: 1, cm: 10, m: 1000, km: 1e6, pc: 3.0856775807e19,
  // angle
  rad: 1, mrad: 1e-3, deg: Math.PI / 180, degree: Math.PI / 180, radian: 1,
};

const FUNCTIONS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos,
  atan: Math.atan, atan2: Math.atan2, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  sqrt: Math.sqrt, exp: Math.exp, log: Math.log, log10: Math.log10, pow: Math.pow,
  abs: Math.abs, fabs: Math.abs, min: Math.min, max: Math.max, floor: Math.floor, ceil: Math.ceil,
};

// A small arithmetic evaluator (numbers, names, + - * / ^, parentheses, function calls).
// GDML attributes may hold expressions such as "2*world" or "pi/2". We don't use eval():
// a GDML file pasted from somewhere else must never be able to run code in the page.
export function evaluate(text, names) {
  const src = String(text).trim();
  let i = 0;
  const peek = () => src[i];
  const skip = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const fail = (msg) => { throw new Error(`cannot evaluate "${src}": ${msg}`); };

  function primary() {
    skip();
    const c = peek();
    if (c === "(") { i++; const v = sum(); skip(); if (peek() !== ")") fail("missing )"); i++; return v; }
    if (c === "+") { i++; return primary(); }
    if (c === "-") { i++; return -power(); }
    const num = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(src.slice(i));
    if (num) { i += num[0].length; return parseFloat(num[0]); }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
    if (id) {
      i += id[0].length;
      const name = id[0];
      skip();
      if (peek() === "(") {
        i++;
        const args = [];
        skip();
        if (peek() !== ")") {
          for (;;) { args.push(sum()); skip(); if (peek() === ",") { i++; continue; } break; }
        }
        if (peek() !== ")") fail("missing ) after arguments");
        i++;
        const f = FUNCTIONS[name];
        if (!f) fail(`unknown function ${name}`);
        return f(...args);
      }
      if (Object.prototype.hasOwnProperty.call(names, name)) return names[name];
      if (name === "pi") return Math.PI;
      if (name === "e") return Math.E;
      if (Object.prototype.hasOwnProperty.call(UNITS, name)) return UNITS[name];
      fail(`unknown name ${name}`);
    }
    fail(`unexpected "${c ?? "end"}"`);
  }
  function power() {
    const base = primary();
    skip();
    if (peek() === "^") { i++; return Math.pow(base, power()); }
    return base;
  }
  function product() {
    let v = power();
    for (;;) {
      skip();
      const c = peek();
      if (c === "*") { i++; v *= power(); } else if (c === "/") { i++; v /= power(); } else return v;
    }
  }
  function sum() {
    let v = product();
    for (;;) {
      skip();
      const c = peek();
      if (c === "+") { i++; v += product(); } else if (c === "-") { i++; v -= product(); } else return v;
    }
  }
  if (src === "") fail("empty");
  const v = sum();
  skip();
  if (i < src.length) fail(`unexpected "${src.slice(i)}"`);
  return v;
}

function unitOf(name, fallback) {
  if (!name) return UNITS[fallback];
  const u = UNITS[name];
  if (u === undefined) throw new Error(`unknown unit "${name}"`);
  return u;
}

const children = (el) => Array.from(el?.children ?? []);
const first = (el, tag) => children(el).find((c) => c.tagName === tag);

// Read a GDML document. Returns { world, volumes, solids, warnings }.
export function readGDML(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    const detail = /error on line[^\n]*/i.exec(err.textContent)?.[0] ?? err.textContent.split("\n")[0];
    throw new Error("not valid XML (" + detail.trim() + ")");
  }
  const root = doc.documentElement;
  if (root.tagName !== "gdml") throw new Error(`top element is <${root.tagName}>, expected <gdml>`);

  const warnings = [];
  const warn = (msg) => { if (!warnings.includes(msg)) warnings.push(msg); };
  const names = {};      // constants, variables, quantities
  const positions = {};  // name -> [x, y, z] in mm
  const rotations = {};  // name -> [x, y, z] in rad

  const num = (el, attr, dflt = 0) => {
    const v = el.getAttribute(attr);
    return v === null || v === "" ? dflt : evaluate(v, names);
  };
  const vec = (el, defUnit) => {
    const u = unitOf(el.getAttribute("unit"), defUnit);
    return [num(el, "x") * u, num(el, "y") * u, num(el, "z") * u];
  };

  // <define>
  for (const def of children(root).filter((c) => c.tagName === "define")) {
    for (const el of children(def)) {
      const name = el.getAttribute("name");
      switch (el.tagName) {
        case "constant":
        case "variable":
          names[name] = num(el, "value");
          break;
        case "quantity":
          names[name] = num(el, "value") * unitOf(el.getAttribute("unit"), "mm");
          break;
        case "position":
          positions[name] = vec(el, "mm");
          break;
        case "rotation":
          rotations[name] = vec(el, "rad");
          break;
        case "expression":
          names[name] = evaluate(el.textContent, names);
          break;
        default:
          warn(`<define>: <${el.tagName}> is ignored`);
      }
    }
  }

  // Position and rotation of a placement: inline <position>/<rotation> or a *ref to a <define>.
  const placementOf = (el) => {
    let pos = [0, 0, 0];
    let rot = [0, 0, 0];
    for (const c of children(el)) {
      const ref = c.getAttribute("ref");
      if (c.tagName === "position") pos = vec(c, "mm");
      else if (c.tagName === "positionref") pos = positions[ref] ?? (warn(`unknown position "${ref}"`), pos);
      else if (c.tagName === "rotation") rot = vec(c, "rad");
      else if (c.tagName === "rotationref") rot = rotations[ref] ?? (warn(`unknown rotation "${ref}"`), rot);
      else if (c.tagName === "scale" || c.tagName === "scaleref") warn("reflections (<scale>) are not drawn");
    }
    return { pos, rot };
  };
  const firstPlacementOf = (el) => {
    let pos = [0, 0, 0];
    let rot = [0, 0, 0];
    for (const c of children(el)) {
      const ref = c.getAttribute("ref");
      if (c.tagName === "firstposition") pos = vec(c, "mm");
      else if (c.tagName === "firstpositionref") pos = positions[ref] ?? pos;
      else if (c.tagName === "firstrotation") rot = vec(c, "rad");
      else if (c.tagName === "firstrotationref") rot = rotations[ref] ?? rot;
    }
    return { pos, rot };
  };

  // <solids>: each solid becomes { type, name, ...dimensions in mm/rad }
  const solids = {};
  for (const sec of children(root).filter((c) => c.tagName === "solids")) {
    for (const el of children(sec)) {
      const name = el.getAttribute("name");
      const L = unitOf(el.getAttribute("lunit"), "mm");
      const A = unitOf(el.getAttribute("aunit"), "rad");
      const len = (a, d = 0) => num(el, a, d) * L;
      const ang = (a, d = 0) => num(el, a, d) * A;
      const s = { type: el.tagName, name };
      switch (el.tagName) {
        case "box":
          Object.assign(s, { x: len("x"), y: len("y"), z: len("z") });
          break;
        case "tube":
        case "cutTube":
          Object.assign(s, { rmin: len("rmin"), rmax: len("rmax"), z: len("z"),
            startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A) });
          if (el.tagName === "cutTube") warn("cutTube is drawn as a plain tube (the cut planes are ignored)");
          break;
        case "cone":
          Object.assign(s, { rmin1: len("rmin1"), rmax1: len("rmax1"), rmin2: len("rmin2"), rmax2: len("rmax2"),
            z: len("z"), startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A) });
          break;
        case "sphere":
          Object.assign(s, { rmin: len("rmin"), rmax: len("rmax"),
            startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A),
            starttheta: ang("starttheta"), deltatheta: ang("deltatheta", Math.PI / A) });
          break;
        case "orb":
          s.r = len("r");
          break;
        case "torus":
          Object.assign(s, { rmin: len("rmin"), rmax: len("rmax"), rtor: len("rtor"),
            startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A) });
          break;
        case "eltube": // half-lengths, as in G4EllipticalTube
          Object.assign(s, { dx: len("dx"), dy: len("dy"), dz: len("dz") });
          break;
        case "trd": // full lengths
          Object.assign(s, { x1: len("x1"), x2: len("x2"), y1: len("y1"), y2: len("y2"), z: len("z") });
          break;
        case "polycone":
        case "polyhedra":
          Object.assign(s, { startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A),
            numsides: num(el, "numsides", 0),
            planes: children(el).filter((c) => c.tagName === "zplane").map((p) => ({
              rmin: num(p, "rmin") * L, rmax: num(p, "rmax") * L, z: num(p, "z") * L })) });
          break;
        case "genericPolycone":
          Object.assign(s, { type: "genericPolycone", startphi: ang("startphi"), deltaphi: ang("deltaphi", 2 * Math.PI / A),
            points: children(el).filter((c) => c.tagName === "rzpoint").map((p) => [num(p, "r") * L, num(p, "z") * L]) });
          break;
        case "union":
        case "subtraction":
        case "intersection": {
          const { pos, rot } = placementOf(el);
          const fp = firstPlacementOf(el);
          Object.assign(s, { first: first(el, "first")?.getAttribute("ref"), second: first(el, "second")?.getAttribute("ref"),
            pos, rot, firstPos: fp.pos, firstRot: fp.rot });
          break;
        }
        default:
          s.unsupported = true;
          warn(`solid <${el.tagName}> is not drawn (only listed)`);
      }
      solids[name] = s;
    }
  }

  // <structure>: volumes and assemblies with their placements
  const volumes = {};
  for (const sec of children(root).filter((c) => c.tagName === "structure")) {
    for (const el of children(sec)) {
      if (el.tagName !== "volume" && el.tagName !== "assembly") {
        warn(`<structure>: <${el.tagName}> is ignored`);
        continue;
      }
      const v = {
        name: el.getAttribute("name"),
        assembly: el.tagName === "assembly",
        material: first(el, "materialref")?.getAttribute("ref") ?? "",
        solid: first(el, "solidref")?.getAttribute("ref") ?? null,
        daughters: [],
      };
      for (const c of children(el)) {
        if (c.tagName === "physvol") {
          const ref = first(c, "volumeref")?.getAttribute("ref");
          if (!ref) {
            warn("physvol without <volumeref> (e.g. an external <file>) is not drawn");
            continue;
          }
          const { pos, rot } = placementOf(c);
          v.daughters.push({ name: c.getAttribute("name") || ref, volume: ref, pos, rot });
        } else if (["replicavol", "paramvol", "divisionvol"].includes(c.tagName)) {
          warn(`<${c.tagName}> is not drawn`);
        }
      }
      volumes[v.name] = v;
    }
  }

  // <setup>: the world volume
  const setup = first(root, "setup");
  const world = first(setup, "world")?.getAttribute("ref");
  if (!world || !volumes[world]) throw new Error("no world volume found in <setup>");

  return { world, volumes, solids, warnings };
}
