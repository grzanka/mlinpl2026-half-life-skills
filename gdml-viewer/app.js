import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { readGDML } from "./gdml.js";
import { buildSolid, rotationMatrix } from "./solids.js";
import { SHIELDING, SHAPES } from "./examples.js";

const $ = (id) => document.getElementById(id);
const stage = $("stage");

// ---------- three.js setup ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
stage.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.75));
const sun = new THREE.DirectionalLight(0xffffff, 1.4);
scene.add(sun);
// Orthographic camera: no perspective, so sizes and gaps read true in the preset views.
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1e7, 1e7);
const controls = new OrbitControls(camera, renderer.domElement);
let content = new THREE.Group();
scene.add(content);

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h);
  fitFrustum();
}
new ResizeObserver(resize).observe(stage);
renderer.setAnimationLoop(() => {
  sun.position.copy(camera.position).add(new THREE.Vector3(0.3, 0.5, 0.2).multiplyScalar(1000));
  renderer.render(scene, camera);
});

// ---------- colours ----------
const KNOWN = {
  G4_WATER: 0x3b82f6, G4_Al: 0xb8bec7, G4_Pb: 0x6b7280, G4_Fe: 0x9a6b4b, G4_Cu: 0xd08a4a,
  G4_W: 0x4b5563, G4_Si: 0x8b5cf6, G4_lAr: 0xa78bfa, G4_CONCRETE: 0xa8a29e,
  "G4_STAINLESS-STEEL": 0x94a3b8, G4_PLASTIC_SC_VINYLTOLUENE: 0x2dd4bf, G4_POLYETHYLENE: 0xe5e7eb,
  G4_PbWO4: 0x22c55e, G4_BGO: 0x14b8a6, G4_SODIUM_IODIDE: 0xf472b6, G4_BONE_COMPACT_ICRU: 0xf5f0e1,
  G4_TISSUE_SOFT_ICRP: 0xf87171, G4_ETHYL_ALCOHOL: 0xfbbf24,
};
const PALETTE = [0xe15759, 0xf28e2b, 0x59a14f, 0x76b7b2, 0xedc948, 0xb07aa1, 0xff9da7, 0x9c755f, 0x4e79a7];
const isGas = (m) => /air|galactic|vacuum|^g4_he$|^g4_ar$|^g4_n$/i.test(m);

// ---------- building the scene ----------
let placed = [];        // { path, volume, material, solidType, mesh, box, edges }
let materialGroups = {}; // material -> { color, objects: [], gas }
let selected = null;

function clearScene() {
  scene.remove(content);
  content.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
  content = new THREE.Group();
  scene.add(content);
  placed = [];
  materialGroups = {};
  selected = null;
}

function show(text) {
  const messages = $("messages");
  messages.innerHTML = "";
  let model;
  try {
    model = readGDML(text);
  } catch (e) {
    messages.innerHTML = `<div class="msg error"><strong>Can't read this GDML.</strong> ${escape(e.message)}</div>`;
    return;
  }
  clearScene();
  const notes = [...model.warnings];
  const note = (m) => { if (!notes.includes(m)) notes.push(m); };
  const geometryCache = {};
  let paletteIndex = 0;

  const groupFor = (material) => {
    if (!materialGroups[material]) {
      const gas = isGas(material);
      materialGroups[material] = {
        color: KNOWN[material] ?? (gas ? 0x9aa3b2 : PALETTE[paletteIndex++ % PALETTE.length]),
        objects: [], gas, visible: true,
      };
    }
    return materialGroups[material];
  };

  const MAX_PLACEMENTS = 20000;
  function place(volumeName, matrix, path, depth) {
    if (placed.length >= MAX_PLACEMENTS) { note(`only the first ${MAX_PLACEMENTS} placements are drawn`); return; }
    if (depth > 30) { note("placements nested deeper than 30 levels are not drawn"); return; }
    const v = model.volumes[volumeName];
    if (!v) { note(`unknown volume "${volumeName}"`); return; }
    const isWorld = depth === 0;

    if (!v.assembly && v.solid) {
      const s = model.solids[v.solid];
      if (!geometryCache[v.solid]) geometryCache[v.solid] = buildSolid(s, model.solids);
      const built = geometryCache[v.solid];
      if (!built) {
        if (s && !s.unsupported) note(`solid "${v.solid}" (${s.type}) could not be drawn`);
        if (!s) note(`unknown solid "${v.solid}"`);
      } else {
        if (built.note) note(built.note);
        const group = groupFor(v.material);
        const wire = isWorld || group.gas;
        const holder = new THREE.Group();
        holder.matrixAutoUpdate = false;
        holder.matrix.copy(matrix);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(built.geometry, 25),
          new THREE.LineBasicMaterial({ color: wire ? 0x8a93a3 : 0x101418, transparent: true, opacity: wire ? 0.5 : 0.6 }));
        let mesh = null;
        if (!wire) {
          mesh = new THREE.Mesh(built.geometry, new THREE.MeshStandardMaterial({
            color: group.color, roughness: 0.6, metalness: 0.05, side: THREE.DoubleSide,
            transparent: true, opacity: 0.88, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
          holder.add(mesh);
        }
        holder.add(edges);
        if (built.outline) {
          const dashed = new THREE.LineSegments(new THREE.EdgesGeometry(built.outline, 25),
            new THREE.LineDashedMaterial({ color: 0xffd84d, dashSize: 3, gapSize: 2 }));
          dashed.computeLineDistances();
          holder.add(dashed);
        }
        content.add(holder);
        holder.updateMatrixWorld(true);
        // exact extent of the solid itself (not of a boolean's dashed outline)
        const box = new THREE.Box3().setFromObject(mesh ?? edges, true);
        const entry = { path, volume: v.name, material: v.material, solidType: s.type, world: isWorld,
          wire, holder, mesh, box, group, pos: new THREE.Vector3().setFromMatrixPosition(matrix) };
        if (mesh) mesh.userData.entry = entry;
        group.objects.push(holder);
        placed.push(entry);
      }
    }
    for (const d of v.daughters) {
      // G4GDMLReadStructure::PhysvolRead: G4Transform3D(GetRotationMatrix(rotation).inverse(), position)
      const local = new THREE.Matrix4().makeTranslation(...d.pos).multiply(rotationMatrix(d.rot).invert());
      place(d.volume, matrix.clone().multiply(local), d.name, depth + 1);
    }
  }
  place(model.world, new THREE.Matrix4(), model.world, 0);

  if (notes.length) {
    messages.innerHTML = `<div class="msg warn"><strong>Shown with caveats:</strong><ul>${notes.map((n) => `<li>${escape(n)}</li>`).join("")}</ul></div>`;
  }
  $("empty").style.display = placed.length ? "none" : "grid";
  renderLegend();
  renderTable();
  setView(currentView);
  window.gdmlViewer = { model, placed }; // for debugging in the browser console
}

// ---------- legend ----------
function renderLegend() {
  const legend = $("legend");
  const entries = Object.entries(materialGroups);
  if (!entries.length) { legend.innerHTML = '<p class="hint">Nothing shown yet.</p>'; return; }
  legend.innerHTML = "";
  for (const [name, g] of entries) {
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = g.visible;
    box.addEventListener("change", () => {
      g.visible = box.checked;
      g.objects.forEach((o) => (o.visible = g.visible));
    });
    const sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = g.gas ? "transparent" : "#" + g.color.toString(16).padStart(6, "0");
    if (g.gas) sw.style.borderStyle = "dashed";
    const text = document.createElement("span");
    text.textContent = `${name || "(no material)"} · ${g.objects.length}${g.gas ? " · outline only" : ""}`;
    label.append(box, sw, text);
    legend.append(label);
  }
}

// ---------- table and selection ----------
const fmt = (v) => (Math.abs(v) < 5e-7 ? 0 : v).toFixed(2);
function renderTable() {
  const rows = $("rows");
  rows.innerHTML = "";
  const MAX_ROWS = 1000;
  for (const [i, e] of placed.slice(0, MAX_ROWS).entries()) {
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    const b = e.box;
    tr.innerHTML = `<td>${escape(e.path)}${e.world ? " (world)" : ""}</td><td>${escape(e.volume)}</td><td>${escape(e.material)}</td>` +
      `<td>${escape(e.solidType)}</td><td class="num">${fmt(b.min.x)} … ${fmt(b.max.x)}</td>` +
      `<td class="num">${fmt(b.min.y)} … ${fmt(b.max.y)}</td><td class="num">${fmt(b.min.z)} … ${fmt(b.max.z)}</td>`;
    tr.addEventListener("click", () => select(e));
    rows.append(tr);
  }
  if (placed.length > MAX_ROWS) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7">… and ${placed.length - MAX_ROWS} more</td>`;
    rows.append(tr);
  }
}

function select(e) {
  if (selected?.mesh) selected.mesh.material.emissive.setHex(0x000000);
  selected = e;
  if (e?.mesh) e.mesh.material.emissive.setHex(0x553300);
  document.querySelectorAll("#rows tr").forEach((tr) => tr.classList.toggle("selected", placed[tr.dataset.index] === e));
  if (!e) { $("info").textContent = "Click a volume, or a row in the table."; return; }
  const b = e.box;
  $("info").textContent =
    `${e.path}\nlogical volume: ${e.volume}\nmaterial: ${e.material}\nsolid: ${e.solidType}\n` +
    `centre: (${fmt(e.pos.x)}, ${fmt(e.pos.y)}, ${fmt(e.pos.z)}) mm\n` +
    `x: ${fmt(b.min.x)} … ${fmt(b.max.x)} mm\ny: ${fmt(b.min.y)} … ${fmt(b.max.y)} mm\nz: ${fmt(b.min.z)} … ${fmt(b.max.z)} mm`;
}

const raycaster = new THREE.Raycaster();
let downAt = null;
renderer.domElement.addEventListener("pointerdown", (ev) => (downAt = [ev.clientX, ev.clientY]));
renderer.domElement.addEventListener("pointerup", (ev) => {
  if (!downAt || Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]) > 4) return; // a drag, not a click
  const r = renderer.domElement.getBoundingClientRect();
  const p = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(p, camera);
  const meshes = placed.filter((e) => e.mesh && e.holder.visible).map((e) => e.mesh);
  const hit = raycaster.intersectObjects(meshes, false)[0];
  select(hit ? hit.object.userData.entry : null);
});

// ---------- camera views ----------
// Each view: the direction the camera looks in, and which axis points up on screen.
const VIEWS = {
  top: { dir: [0, -1, 0], up: [1, 0, 0], axes: "z → right, x ↑ up (looking down from +y)" },
  side: { dir: [1, 0, 0], up: [0, 1, 0], axes: "z → right, y ↑ up (looking from −x)" },
  beam: { dir: [0, 0, 1], up: [0, 1, 0], axes: "looking along the beam (+z), y ↑ up" },
  iso: { dir: [-0.6, -0.5, 0.62], up: [0, 1, 0], axes: "3D view, y ↑ up" },
};
let currentView = "iso";
let fitBox = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));

function sceneBox() {
  // Frame what's inside the world, not the (usually much larger) world box itself.
  const inner = placed.filter((e) => !e.world);
  const box = new THREE.Box3();
  (inner.length ? inner : placed).forEach((e) => box.union(e.box));
  return box.isEmpty() ? new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1)) : box;
}

function setView(name) {
  currentView = name;
  document.querySelectorAll("#views button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === name)));
  const v = VIEWS[name];
  fitBox = sceneBox();
  const centre = fitBox.getCenter(new THREE.Vector3());
  const radius = fitBox.getSize(new THREE.Vector3()).length() || 1;
  const dir = new THREE.Vector3(...v.dir).normalize();
  camera.up.set(...v.up);
  camera.position.copy(centre).addScaledVector(dir, -radius * 4);
  camera.lookAt(centre);
  camera.zoom = 1;
  controls.target.copy(centre);
  $("axes").textContent = v.axes;
  fitFrustum();
  controls.update();
}

function fitFrustum() {
  const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
  const aspect = w / h;
  camera.updateMatrixWorld();
  // extent of the framed box as seen by the camera
  let hw = 0, hh = 0;
  const c = fitBox.getCenter(new THREE.Vector3()).applyMatrix4(camera.matrixWorldInverse);
  for (const x of [fitBox.min.x, fitBox.max.x]) for (const y of [fitBox.min.y, fitBox.max.y]) for (const z of [fitBox.min.z, fitBox.max.z]) {
    const p = new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse);
    hw = Math.max(hw, Math.abs(p.x - c.x));
    hh = Math.max(hh, Math.abs(p.y - c.y));
  }
  const margin = 1.2;
  hw = Math.max(hw, 1e-3) * margin;
  hh = Math.max(hh, 1e-3) * margin;
  if (hw / hh > aspect) hh = hw / aspect; else hw = hh * aspect;
  Object.assign(camera, { left: -hw, right: hw, top: hh, bottom: -hh });
  camera.updateProjectionMatrix();
}

document.querySelectorAll("#views button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

// ---------- input ----------
function load(text) {
  $("src").value = text;
  show(text);
}
$("render").addEventListener("click", () => show($("src").value));
$("src").addEventListener("paste", () => setTimeout(() => show($("src").value), 0));
$("ex-shield").addEventListener("click", () => load(SHIELDING));
$("ex-shapes").addEventListener("click", () => load(SHAPES));
$("file").addEventListener("change", async (ev) => {
  const f = ev.target.files[0];
  if (f) load(await f.text());
  ev.target.value = "";
});
let dragDepth = 0;
window.addEventListener("dragenter", (ev) => { ev.preventDefault(); dragDepth++; stage.classList.add("dragging"); });
window.addEventListener("dragleave", () => { if (--dragDepth <= 0) { dragDepth = 0; stage.classList.remove("dragging"); } });
window.addEventListener("dragover", (ev) => ev.preventDefault());
window.addEventListener("drop", async (ev) => {
  ev.preventDefault();
  dragDepth = 0;
  stage.classList.remove("dragging");
  const f = ev.dataTransfer.files[0];
  if (f) load(await f.text());
  else if (ev.dataTransfer.getData("text")) load(ev.dataTransfer.getData("text"));
});

function escape(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

resize();
