# Mission: fallout shelter 🏠

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md)

> **How thick must a wall be to cut the gamma dose from fallout by 10×, and by 1000×?**

After a nuclear accident, the dose outside comes mostly from gamma rays of fission products on the ground, such as caesium-137 (one gamma line at **662 keV**) and, from activated materials, cobalt-60 (two lines at **1.17 and 1.33 MeV**). A shelter works by putting mass between you and them. The question is how much.

**Predict first.** How many centimetres of concrete for a 10× reduction? And for 1000×? Is 1000× just three times the thickness for 10×?

## The setup

```text
  side view (beam goes left to right, along z)

  gamma rays     │▓▓▓▓▓▓▓▓│                 ┌┐
  662 keV   →    │▓ wall ▓│      20 cm      ││ water slab 30 × 30 × 1 cm
  broad,    →    │▓▓▓▓▓▓▓▓│ ←─────────────→ ││ ("a person")
  parallel  →    │▓▓▓▓▓▓▓▓│                 └┘
               z = 0     z = T          z = T + 20 cm
```

The wall is much wider than the beam, so photons that scatter inside it can still reach the person. That's what makes this different from a textbook "exp(−μx)" calculation.

## Option A: guided prompt

The agent proposes the setup; you decide. Paste into opencode:

```text
/g4-new "Mission: fallout shelter. How thick must a wall of concrete, soil or lead be to cut the gamma dose from fallout (Cs-137: 662 keV; Co-60: 1.17 and 1.33 MeV) by 10x and by 1000x? Propose the geometry, the source, what to score and how many events, explain each choice in one sentence, and ask me before you build anything. Keep the first version small enough to run in a few minutes on 6 cores."
```

Before you approve its proposal, compare it with Option B: is the source broad or a pencil beam? Is the scorer behind the wall, or does it count photons that pass straight through without scattering? How does it plan to find the 10× and 1000× thicknesses?

## Option B: full prompt

Everything pinned down; results comparable with the table below:

```text
/g4-new "Fallout shelter: how thick must a wall be to cut the gamma dose by 10x and by 1000x? World: air, 4 x 4 x 4 m. Wall: ordinary concrete (G4_CONCRETE), 2 x 2 m in x-y, upstream face at z = 0, thickness T. Behind it, a water (G4_WATER) slab of 30 x 30 x 1 cm representing a person, centred on the z axis, its upstream face at z = T + 20 cm. Source: Cs-137 gammas, 662 keV, a broad parallel beam along +z, uniform over a 1 x 1 m square centred on the z axis at z = -10 cm. Physics list QBBC. Score the total dose in Gy in the water slab. Scan T = 0, 10, 20, 30, 40, 50 cm (for T = 0 leave the wall out), 4 million photons per thickness, local run. Output: a CSV with the dose per photon and the reduction factor D(0)/D(T) for each T; the thicknesses that give 10x and 1000x, interpolated on a log scale; and a PNG plot of the reduction factor versus T on a log axis, with the narrow-beam estimate exp(mu T) drawn for comparison, mu taken from NIST XCOM for ordinary concrete at 662 keV."
```

Each thickness takes about a minute on 6 cores, so the whole scan takes a few minutes.

## Check the geometry in the GDML Viewer

Before you approve the geometry stage, check what the agent actually built. Print the geometry file in your workspace (`ls runs` shows your run's directory):

```bash
cat runs/<id>/geometry.gdml
```

Copy the whole output ([how](07-agent-setup.md#copying-text-out-of-opencode)) into the **[GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/)** on your laptop. It draws the geometry, lists every volume's extent in mm, and runs two checks: no volume sticks out of its mother, and no boxes or spheres overlap. You want the green **Checks passed** box, and a table like this:

| Volume | Material | x (mm) | y (mm) | z (mm) |
|---|---|---|---|---|
| Wall, here T = 20 cm | `G4_CONCRETE` | −1000 … 1000 | −1000 … 1000 | 0 … 200 |
| Person (water slab) | `G4_WATER` | −150 … 150 | −150 … 150 | 400 … 410 |

For another thickness T, the wall runs from 0 to T and the slab starts 200 mm behind the wall's back face. If the scan writes one geometry per thickness, check at least the thickest one: it's the one most likely to stick out of the world or swallow the slab.

## What to check

| Stage | Check |
|---|---|
| Geometry | Wall **starts** at z = 0; the person slab is **behind** the wall, 20 cm from its back face, so it moves when T changes. [Check it in the GDML Viewer](#check-the-geometry-in-the-gdml-viewer) |
| Source | A **plane** source 1 × 1 m, not a point or pencil beam; mono-energetic 662 keV |
| Scoring | Dose in the water slab, all particles (not only photons that didn't interact) |
| Scan | Same number of photons for each thickness; T = 0 is a run without the wall |
| Results | Reduction factor grows with T; the 1000× thickness is **more** than three times the 10× one |

## Check against

From our own runs (Geant4 11.4.2, QBBC, the Option B setup, 4 million photons per point):

| Source | Wall | 10× less dose | 1000× less dose | Each further 10× |
|---|---|---|---|---|
| Cs-137, 662 keV | Concrete (2.3 g/cm³) | ≈ 21 cm | ≈ 53 cm | ≈ 16 cm |
| Cs-137, 662 keV | Lead | ≈ 2.3 cm | ≈ 6.8 cm | ≈ 2.2 cm |
| Co-60, 1.25 MeV (mono-energetic approximation) | Concrete | ≈ 27 cm | ≈ 69 cm | ≈ 21 cm |
| Co-60, 1.25 MeV | Lead | ≈ 4.7 cm | ≈ 12.6 cm | ≈ 4.0 cm |

Raw numbers for Cs-137 behind concrete: reduction 2.7× at 10 cm, 9.2× at 20 cm, 38× at 30 cm, 170× at 40 cm, 660× at 50 cm.

Compare with the **narrow-beam** estimate, which counts only photons that pass through without interacting. With the mass attenuation coefficients from the [NIST tables](https://physics.nist.gov/PhysRefData/XrayMassCoef/) (concrete 0.0788 cm²/g and lead 0.111 cm²/g at 662 keV, interpolated):

| Wall, 662 keV | μ | Narrow-beam 10× (one tenth-value layer) | Narrow-beam 1000× |
|---|---|---|---|
| Concrete | 0.181 cm⁻¹ | 12.7 cm | 38 cm |
| Lead | 1.26 cm⁻¹ | 1.8 cm | 5.5 cm |

The full simulation needs **thicker** walls, because photons that scatter in the wall still reach the person: this is called **buildup**. The deep tenth-value layers from the simulation (about 16 cm of concrete and 2.2 cm of lead for Cs-137; about 21 cm and 4.0 cm for Co-60) agree with the broad-beam values in radiation-protection tables (NCRP reports).

## Failure modes to hunt

- **Narrow beam instead of broad.** A pencil beam and a small scorer, or scoring only unscattered photons, reproduces exp(−μx) and underestimates the wall you need.
- **"1000× = 3 × the 10× thickness."** True for the narrow-beam formula, not with buildup: the first tenth-value layer is the thickest.
- **Moving the wrong thing.** The person should stay 20 cm behind the wall's back face; if the slab stays at a fixed z, thicker walls also move it closer.
- **Statistics at 1000×.** Only about 1 photon in 1000 contributes; check the agent's uncertainty, not just the value.
- **Soil.** Geant4 has no `G4_SOIL`. Ask the agent what it uses and where the composition and density come from.
- **Units.** Dose per photon is a tiny number (about 10⁻¹⁶ Gy); a wrong unit prefix can hide in it.

## Going further

- Swap the wall for **lead** or **soil**, or the source for **Co-60** (two lines, 1.17 and 1.33 MeV). Does the order of materials by thickness match the order by density?
- Fallout lies **on the ground all around you**, not in a beam. Ask the agent for an isotropic source on a large plane, and see how much a roof helps compared with walls.
- Ask the agent to compare its 10× thickness with a published tenth-value layer, and to tell you exactly which table it used.

---

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md) · [Next mission: snowman →](11-mission-snowman.md) · [After your mission: agent as explorer →](13-agent-as-explorer.md)
