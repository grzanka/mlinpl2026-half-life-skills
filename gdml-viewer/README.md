# GDML Viewer

A web page that shows a Geant4 GDML geometry in 3D, with the position of every placed volume in mm.
Paste the GDML, drop a `.gdml` file on the page, or open one; everything runs in the browser and
nothing is uploaded.

**Online:** https://grzanka.github.io/mlinpl2026-half-life-skills/ (deployed from `main` by
[`.github/workflows/pages.yml`](../.github/workflows/pages.yml)).

**Locally:** browsers don't load JavaScript modules from `file://`, so serve the folder:

```bash
python3 -m http.server 8000 --directory gdml-viewer
```

then open http://localhost:8000.

## What it draws

| GDML | Drawn |
|---|---|
| `box`, `tube`, `cone`, `sphere`, `orb`, `torus`, `eltube`, `trd`, `polycone`, `genericPolycone`, `polyhedra` | Exactly |
| `cutTube` | As a plain tube (cut planes ignored) |
| `union`, `subtraction`, `intersection` | The first solid, with the second as a dashed outline |
| Other solids, `replicavol`, `paramvol`, `divisionvol`, reflections | Not drawn; listed in the warnings |
| `<define>`: `constant`, `variable`, `quantity`, `position`, `rotation`, `expression` | Yes, including expressions such as `2*pitch` or `pi/2` |
| Nested volumes, `assembly`, `positionref`/`rotationref` | Yes |

Rotations follow Geant4: a `physvol` is placed with the **inverse** of `Rz·Ry·Rx` built from the
GDML angles (`G4GDMLReadStructure.cc`), while the second solid of a boolean uses the matrix as it is
(`G4GDMLReadSolids.cc`). A 100 mm bar placed with `rotation z="30" unit="deg"` therefore has its
+x tip at (43.3, −25, 0) mm, as in Geant4.

## Checks

After drawing, the viewer runs two checks that never raise a false alarm:

- **Sticking out:** a volume whose extent reaches beyond its mother's extent (for example a world that is too small).
- **Overlaps between neighbours:** computed exactly for unrotated boxes and for full spheres (`orb`, or `sphere` without cuts). The overlap depth is reported in mm.

Pairs of other shapes whose bounding boxes touch are counted and reported as not checked; use Geant4's
own overlap check for those (`/geometry/test/run`, or the geant4-ai toolkit's `check_geometry.py`).

Air, vacuum and the world volume are drawn as outlines only. Each material gets one colour, and
the table lists every placed volume with its extent in x, y and z.

## Files

| File | What it does |
|---|---|
| `index.html` | Page layout and styles |
| `app.js` | Placement, colours, camera views, selection, the table |
| `gdml.js` | Reads GDML into plain data (no three.js); has its own expression evaluator, so a pasted file can't run code |
| `solids.js` | three.js geometry for each solid |
| `examples.js` | The two example geometries |

three.js 0.160 is loaded from the jsDelivr CDN.
