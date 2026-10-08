# Mission: cockroach at the LHC 🪳

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md)

> **A 6.8 TeV proton from the LHC beam is lost on a collimator. What dose does a cockroach sitting nearby in the tunnel get, and how many lost protons would it take to kill it?**

A single LHC proton carries 6.8 TeV, about the kinetic energy of a flying mosquito, and the beam holds about 3 × 10¹⁴ of them. When protons are lost on a collimator (the metal jaws that clean the beam halo), each one starts a hadronic shower: thousands of secondary particles, some of which leave the collimator and irradiate whatever sits nearby.

Cockroaches are famously tough. Their lethal dose (LD50, the dose that kills half of them) is roughly **700–1000 Gy**, against about **4–5 Gy** for humans ([Iowa State University Extension](https://yardandgarden.extension.iastate.edu/article/1996/12-13-1996/bomb.html)).

**Predict first.** Dose per lost proton, 50 cm from the collimator: 10⁻⁶ Gy? 10⁻¹¹ Gy? 10⁻¹⁶ Gy? And would losing a single bunch of the beam (about 10¹¹ protons) harm a human standing there?

## The setup

```text
  side view (beam goes left to right, along z)

                                         x = 50 cm   ▢ cockroach (water, 1 g)
                                                     ┆
  6.8 TeV p  →   ███████████████████████████████    ┆ 50 cm from the beam axis
                 █ tungsten block 8 × 8 × 100 cm █
                 ███████████████████████████████
               z = 0                           z = 100 cm
```

The block stands in for a tungsten collimator jaw, hit head-on (a real loss grazes the jaw's surface). The cockroach is 1 cm³ of water, 50 cm from the beam axis, level with the downstream end of the block.

## The statistics problem

A 1 cm³ cockroach is a tiny target 50 cm away: in our test, a single cube got any energy at all in only about **1 event in 10**. With showers taking about **35 CPU-seconds per proton**, you can't simulate your way out of that with brute force.

The trick: the shower is roughly symmetric around the beam axis, so put the cockroach in **every direction at once**, as a thin water **ring** around the axis (inner radius 49.5 cm, outer 50.5 cm, 1 cm long). Each 1 cm³ of the ring is one cockroach at the same distance, and the ring collects about 300 times more hits than a single cube.

## Option A: guided prompt

```text
/g4-new "Mission: cockroach at the LHC. A 6.8 TeV proton from the LHC beam is lost on a collimator in the tunnel. What dose does a cockroach (about 1 g, water-equivalent) sitting nearby get per lost proton, and how many lost protons would kill it (LD50 roughly 700 to 1000 Gy) or a human (about 4 to 5 Gy)? Propose a simplified geometry, the physics list, where the cockroach sits, how to get enough statistics, and how many events; explain each choice in one sentence and ask me before building. Tell me how long the run will take on 6 cores before you start it."
```

Before approving, check: does the agent see the statistics problem by itself? What does it propose to do about it? Which physics list does it pick for TeV protons, and why?

## Option B: full prompt

```text
/g4-new "Cockroach at the LHC. World: air, 4 x 4 x 6 m. Collimator: a tungsten (G4_W) block 8 x 8 cm in x-y and 100 cm long in z, centred on the z axis, upstream face at z = 0. Beam: 6.8 TeV protons, pencil beam along +z on the axis, starting at z = -10 cm. Physics list FTFP_BERT. Cockroach: to get enough statistics, model it as a thin water (G4_WATER) ring around the beam axis, inner radius 49.5 cm, outer radius 50.5 cm, 1 cm long in z, centred at z = 100 cm; every 1 cm3 of the ring is one cockroach 50 cm from the axis, level with the downstream end of the block. Score the dose in Gy in the ring. 48 events, local run, and report the time per event. Output: the dose per lost proton in Gy with its statistical uncertainty; how many lost protons give 4.5 Gy (human LD50) and 1000 Gy (cockroach LD50); and these numbers expressed in LHC bunches (1.15e11 protons per bunch) and as a fraction of a full beam (2808 bunches)."
```

48 events take about 5 minutes on 6 cores. For better statistics, ask the agent to rerun with 500 events as a **batch job on the cluster**, for example: "submit the same run with 500 events as a Slurm batch job on partition cpu, 24 cores, 30 minutes".

## What to check

| Stage | Check |
|---|---|
| Geometry | Block **starts** at z = 0 and is 1 m long; the ring doesn't overlap the block (its inner radius is 49.5 cm, the block is 4 cm wide on each side). Look at it in the [GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/) |
| Physics | A list made for high energies, such as `FTFP_BERT`, and the agent can say why |
| Beam | 6.8 **TeV** (not GeV, not MeV) |
| Scoring | Dose in the water ring, not in the block |
| Run | It reports the time per event before launching anything long |
| Results | A value **with an uncertainty**, and protons-to-LD50 computed from it |

## Check against

From our own run (Geant4 11.4.2, FTFP_BERT, the Option B setup, 144 protons, about 35 CPU-seconds per proton):

| Quantity | Value |
|---|---|
| Dose per lost proton, 50 cm from the axis | (2.8 ± 0.1) × 10⁻¹¹ Gy |
| Lost protons for 4.5 Gy (human LD50) | ≈ 1.6 × 10¹¹, about **1.4 bunches** |
| Lost protons for 1000 Gy (cockroach LD50) | ≈ 3.5 × 10¹³, about 300 bunches, **≈ 11 % of a full beam** |
| A full beam (3.2 × 10¹⁴ protons) lost here | ≈ 9000 Gy |

So a person standing next to the collimator would get a lethal dose from losing about one bunch on it; the cockroach needs around a tenth of the whole beam. That's one reason nobody is allowed in the LHC tunnel while there's beam.

## Failure modes to hunt

- **Brute force on a tiny cube.** A 1 cm³ cockroach with 48 events gives a result that is mostly noise, or exactly zero. Does the agent report an uncertainty? Does it notice?
- **GeV vs TeV.** A factor 1000 in energy, and roughly in dose. Check the `/gps/energy` line in the macro.
- **Dose vs energy.** Dose is energy per **mass**. The ring weighs about 314 g; dividing by 1 g instead (or by the wrong mass) gives the wrong answer by a large factor. With a dose scorer the mass is handled for you; check which quantity the agent scored.
- **Wrong physics list.** Low-energy lists (or `QBBC` without saying why) for 6.8 TeV protons: ask the agent to justify its choice from the Geant4 documentation.
- **A run that never ends.** At about 35 CPU-seconds per proton, 10 000 events on 6 cores is 16 hours. The agent should estimate the time and ask before launching.
- **The jaw is not a block.** Real losses graze the jaw's surface at a tiny angle. Ask the agent how that would change the result, and how it would set it up.

## Going further

- Move the cockroach: 1 m and 2 m from the axis, or 1 m downstream of the block. How does the dose fall with distance? Like 1/r²?
- Run a **batch job** on the cluster with 500 or more events and compare the uncertainty with the local run.
- Compare tungsten with **carbon**, the material of the LHC's primary collimators. Where does the shower go now?
- Replace the cockroach with a human-sized water slab. Which quantity would you report for a person, and why isn't it the same as for a 1 g insect?

---

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md) · [After your mission: agent as explorer →](13-agent-as-explorer.md)
