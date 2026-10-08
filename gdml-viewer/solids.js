// three.js geometry for the GDML solids read by gdml.js. Everything is in mm, with the solid's
// own z axis as the axis of symmetry, as in Geant4.
import * as THREE from "three";

const TWO_PI = 2 * Math.PI;
const SEGMENTS = 64; // facets on a full circle

// Rotation matrix Geant4 builds from GDML angles: rotateX, then rotateY, then rotateZ
// (G4GDMLReadDefine::GetRotationMatrix), i.e. Rz * Ry * Rx.
export function rotationMatrix([rx, ry, rz]) {
  return new THREE.Matrix4()
    .makeRotationZ(rz)
    .multiply(new THREE.Matrix4().makeRotationY(ry))
    .multiply(new THREE.Matrix4().makeRotationX(rx));
}

// A solid of revolution around z. `loops` are closed polygons in the (r, z) half-plane:
// the first is the outline, the others are holes. The profile is swept from phi0 to phi0 + dphi.
// `vertexScale` turns polyhedra side distances into corner distances.
function revolve(loops, phi0, dphi, segments, vertexScale = 1) {
  const full = dphi >= TWO_PI - 1e-9;
  if (full) dphi = TWO_PI;
  const n = Math.max(1, segments ?? Math.max(3, Math.ceil((SEGMENTS * dphi) / TWO_PI)));
  const pos = [];
  const at = (r, z, phi) => [r * vertexScale * Math.cos(phi), r * vertexScale * Math.sin(phi), z];
  const tri = (a, b, c) => pos.push(...a, ...b, ...c);

  for (const loop of loops) {
    for (let i = 0; i < loop.length; i++) {
      const [r1, z1] = loop[i];
      const [r2, z2] = loop[(i + 1) % loop.length];
      if (r1 === 0 && r2 === 0) continue; // edge on the axis sweeps no surface
      for (let k = 0; k < n; k++) {
        const p0 = phi0 + (dphi * k) / n;
        const p1 = phi0 + (dphi * (k + 1)) / n;
        const a = at(r1, z1, p0), b = at(r2, z2, p0), c = at(r2, z2, p1), d = at(r1, z1, p1);
        tri(a, b, c);
        tri(a, c, d);
      }
    }
  }
  if (!full) {
    // flat faces at both ends of the phi segment
    const outline = loops[0].map(([r, z]) => new THREE.Vector2(r, z));
    const holes = loops.slice(1).map((l) => l.map(([r, z]) => new THREE.Vector2(r, z)));
    const all = outline.concat(...holes);
    const faces = THREE.ShapeUtils.triangulateShape(outline, holes);
    for (const phi of [phi0, phi0 + dphi]) {
      for (const [i, j, k] of faces) {
        tri(at(all[i].x, all[i].y, phi), at(all[j].x, all[j].y, phi), at(all[k].x, all[k].y, phi));
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

const circle = (cr, cz, radius, n = 32) =>
  Array.from({ length: n }, (_, i) => [cr + radius * Math.cos((TWO_PI * i) / n), cz + radius * Math.sin((TWO_PI * i) / n)]);

function zPlanesLoop(planes) {
  const outer = planes.map((p) => [p.rmax, p.z]);
  const inner = planes.map((p) => [p.rmin, p.z]).reverse();
  return outer.concat(inner);
}

// Returns { geometry, note } where note explains anything only approximately drawn,
// or null for solids that can't be drawn.
export function buildSolid(s, solids, depth = 0) {
  if (!s || depth > 20) return null;
  switch (s.type) {
    case "box":
      return { geometry: new THREE.BoxGeometry(s.x, s.y, s.z) };
    case "tube":
    case "cutTube":
      return { geometry: revolve([[[s.rmin, -s.z / 2], [s.rmax, -s.z / 2], [s.rmax, s.z / 2], [s.rmin, s.z / 2]]],
        s.startphi, s.deltaphi) };
    case "cone":
      return { geometry: revolve([[[s.rmin1, -s.z / 2], [s.rmax1, -s.z / 2], [s.rmax2, s.z / 2], [s.rmin2, s.z / 2]]],
        s.startphi, s.deltaphi) };
    case "sphere": {
      const m = 32;
      const t = (k) => s.starttheta + (s.deltatheta * k) / m;
      const outer = Array.from({ length: m + 1 }, (_, k) => [s.rmax * Math.sin(t(k)), s.rmax * Math.cos(t(k))]);
      const inner = s.rmin > 0
        ? Array.from({ length: m + 1 }, (_, k) => [s.rmin * Math.sin(t(m - k)), s.rmin * Math.cos(t(m - k))])
        : [[0, 0]];
      return { geometry: revolve([outer.concat(inner)], s.startphi, s.deltaphi) };
    }
    case "orb":
      return { geometry: new THREE.SphereGeometry(s.r, SEGMENTS, SEGMENTS / 2) };
    case "torus": {
      const loops = [circle(s.rtor, 0, s.rmax)];
      if (s.rmin > 0) loops.push(circle(s.rtor, 0, s.rmin).reverse());
      return { geometry: revolve(loops, s.startphi, s.deltaphi) };
    }
    case "eltube": {
      const g = new THREE.CylinderGeometry(1, 1, 2 * s.dz, SEGMENTS);
      g.rotateX(Math.PI / 2); // cylinder axis y -> z
      g.scale(s.dx, s.dy, 1);
      return { geometry: g };
    }
    case "trd": {
      const g = new THREE.BoxGeometry(1, 1, s.z);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const low = p.getZ(i) < 0;
        p.setX(i, p.getX(i) * (low ? s.x1 : s.x2));
        p.setY(i, p.getY(i) * (low ? s.y1 : s.y2));
      }
      g.computeVertexNormals();
      return { geometry: g };
    }
    case "polycone":
      return { geometry: revolve([zPlanesLoop(s.planes)], s.startphi, s.deltaphi) };
    case "genericPolycone":
      return { geometry: revolve([s.points], s.startphi, s.deltaphi) };
    case "polyhedra": {
      const sides = Math.max(3, s.numsides);
      // G4Polyhedra radii are distances to the flat sides; the corners are further out.
      const scale = 1 / Math.cos(s.deltaphi / sides / 2);
      return { geometry: revolve([zPlanesLoop(s.planes)], s.startphi, s.deltaphi, sides, scale) };
    }
    case "union":
    case "subtraction":
    case "intersection": {
      // Drawn as the first solid, with the second one as an outline: computing the real
      // boolean shape would need a mesh-boolean library.
      const a = buildSolid(solids[s.first], solids, depth + 1);
      const b = buildSolid(solids[s.second], solids, depth + 1);
      if (!a) return null;
      const firstM = new THREE.Matrix4().makeTranslation(...s.firstPos).multiply(rotationMatrix(s.firstRot));
      a.geometry.applyMatrix4(firstM);
      let outline = null;
      if (b) {
        // G4GDMLReadSolids::BooleanRead: G4Transform3D(GetRotationMatrix(rotation), position),
        // applied to the second solid as is (unlike physvol placements, no inverse).
        b.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(...s.pos).multiply(rotationMatrix(s.rot)));
        outline = b.geometry;
      }
      return { geometry: a.geometry, outline,
        note: `${s.type} drawn as its first solid "${s.first}", second solid "${s.second}" as a dashed outline` };
    }
    default:
      return null;
  }
}
