# Worked example: does more shielding mean less dose?

[← Setting up the agent](07-agent-setup.md) · [Agenda](00-agenda.md)

We build one simulation together, step by step: I type on the projector, you type the same on your machine. You need the agent running in your workspace ([Setting up the agent](07-agent-setup.md)).

> **On Ares:** work on your compute node, not the login node. Not sure where you are, or opened a new terminal? See [Before you start](04-test-geant4.md#0-before-you-start).

## The question

A beam of 52 MeV protons comes from the left. You can put an aluminium plate in front of a detector: **1 mm or 1 cm thick**. The detector is a thin layer of water (think: tissue) 2 cm behind the front of the plate.

**Which detector gets the higher dose: the one behind 1 mm of aluminium, or the one behind 1 cm?**

Make a guess before we run anything, and write it down.

## The setup

We simulate both cases in **one run**: two plates side by side, a broad beam covering both, and one scorer behind each plate.

```text
  side view (beam goes left to right, along z)

              z = 0      z = 1 cm     z = 2 cm
                |            |            |
  x = +5 cm     ██████████████            ▒
  protons  →    ██ Al 10 mm ██   air      ▒  water 1 mm: scorer "thick"
  52 MeV   →    ██████████████            ▒
  x = 0    ─────────────────────────────────
  broad,   →    █                         ▒
  uniform  →    █ Al 1 mm        air      ▒  water 1 mm: scorer "thin"
  x = -5 cm     █                         ▒
```

| Part | What it is |
|---|---|
| World | Air |
| Shields | Aluminium (`G4_Al`), each 5 cm wide (x) and 10 cm tall (y). Left: x from −5 to 0 cm, **1 mm** thick. Right: x from 0 to 5 cm, **10 mm** thick. Both start at z = 0 |
| Detectors | Water (`G4_WATER`), 1 mm thick, one behind each shield, same width and height, front face at z = 2 cm |
| Beam | 52 MeV protons along +z, parallel, uniform over a 10 × 10 cm square at z = −1 cm, so both halves get the same number of protons |
| Scoring | Two scoring meshes, dose in Gy: 3 × 3 cm, centred on each detector (x = −2.5 cm and x = +2.5 cm), through its 1 mm thickness, one bin each |
| Physics | `QBBC` |
| Events | 200 000 (about 30 s on 6 cores) |

## Step 1: start the pipeline

In the opencode window, in your workspace, type:

```text
/g4-new "Proton shielding test. World: air. Two aluminium (G4_Al) shields side by side, each 5 cm wide in x and 10 cm tall in y: the left one (x from -5 to 0 cm) is 1 mm thick, the right one (x from 0 to 5 cm) is 10 mm thick; both have their upstream face at z = 0. Behind each shield, a 1 mm thick water (G4_WATER) detector with the same width and height, upstream face at z = 2 cm. Beam: 52 MeV protons, a broad parallel beam along +z, uniform over a 10 x 10 cm square centred on the z axis, starting at z = -1 cm, so it covers both shields equally. Physics list QBBC. Scoring: two separate scoring meshes of dose in Gy, each 3 x 3 cm in x-y, centred on one detector (x = -2.5 cm and x = +2.5 cm), covering the detector's 1 mm thickness, one bin each. 200000 events, local run. Output: both doses and their ratio (10 mm / 1 mm) in a CSV file, and a bar chart of the two doses as PNG."
```

Tired of approving every command? Quit and restart with `opencode --auto --continue`: same session, fewer prompts ([what `--auto` does](07-agent-setup.md#fewer-prompts---auto)).

The more the prompt pins down, the fewer questions the agent has to ask. Anything it still asks about, answer from [the setup table](#the-setup).

## Step 2: approve stage by stage

The agent stops after each stage and shows you what it made. Don't just press Enter: check the things below, and if something is off, say so in plain words ("the right shield must be 10 mm, not 1 cm wide").

| Stage | Check |
|---|---|
| 1. Plan | Both thicknesses, both detector positions, 52 MeV, 200 000 events, QBBC |
| 2. Geometry | Shields **start** at z = 0 (not centred on it). Detectors start at z = 2 cm. No overlaps reported. [Look at it](#look-at-the-geometry) |
| 3. Physics | `QBBC` |
| 4. Beam and scoring | Beam is a **plane** source covering both halves, not a pencil beam. Each mesh sits inside a **water detector**, not inside a shield. The quantity is dose |
| 5. Compile and run | It compiles; the run finishes. Approve the build and run commands one at a time |
| 6. Results | Two dose values and their ratio, and the bar chart |

### Look at the geometry

Before approving stage 2, look at what the agent built. Open the **[GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/)** in a browser on your laptop (it runs entirely in the browser; nothing is uploaded). Then print the geometry file in your workspace:

```bash
cat runs/*/geometry.gdml
```

(With several runs, name the one you mean, e.g. `runs/proton-shield-al/geometry.gdml`.) Copy the whole output and paste it into the viewer. It starts in a top view, with the beam going left to right. The table under the picture lists every volume's extent in mm. For our setup:

| Volume | x (mm) | z (mm) |
|---|---|---|
| 1 mm shield | −50 … 0 | 0 … 1 |
| 10 mm shield | 0 … 50 | 0 … 10 |
| Detectors | −50 … 0 and 0 … 50 | 20 … 21 |

If the shields come out at −0.5 … 0.5 and −5 … 5, they're centred on z = 0: tell the agent before you approve. The viewer's **Example: shielding** button loads a correct version to compare with.

## Step 3: look at the result

Open the bar chart (on Ares, copy it to your computer first: [how](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)). When we ran it, we got:

| Detector behind | Dose (200 000 protons) |
|---|---|
| 1 mm Al | 4.1 × 10⁻⁶ Gy |
| 10 mm Al | 9.9 × 10⁻⁶ Gy |
| **Ratio 10 mm / 1 mm** | **≈ 2.4** |

Ten times more aluminium, and **2.4 times more dose**. Your numbers should be close; statistical noise moves them by a few percent.

## Why

It's the Bragg peak from the [first simulation](05-first-simulation.md), seen from the other side.

- Behind 1 mm of aluminium the protons have lost only a few MeV. They're still fast, and fast protons deposit little energy per millimetre.
- 10 mm of aluminium is almost the full range of a 52 MeV proton. The protons that come out are slow, near the end of their range, and slow protons deposit much more energy per millimetre. Our 1 mm detector sits right in their Bragg peak.

Dose is energy per mass, so the same number of protons gives more dose when they're slow. A shield only helps once it's thick enough to **stop** the protons; a shield that only slows them down can make things worse.

Ask the agent to explain it too, and check whether its explanation matches:

```text
/g4 Why is the dose behind 10 mm of aluminium higher than behind 1 mm in this run? Use the stopping power of protons in water at the energies that reach each detector.
```

## Step 4: change one thing and rerun

Ask the agent to rerun with a different beam energy, one change at a time. Our results, as a guide:

| Beam energy | Ratio 10 mm / 1 mm | What happens |
|---|---|---|
| 45 MeV | ≈ 0 | 10 mm of aluminium stops every proton: the shield works |
| 49 MeV | ≈ 5 | The protons come out just at the end of their range: the worst case |
| 52 MeV | ≈ 2.4 | Our run |
| 70 MeV | ≈ 1.3 | Fast enough that the slowdown matters less |
| 100 MeV | ≈ 1.1 | Both detectors see fast protons |

1. **45 MeV.** Does the dose behind 10 mm drop to almost zero?
2. **49 MeV.** How big does the ratio get?
3. **Your own idea:** a thicker shield, lead instead of aluminium, or a thicker detector. Predict first, then run.

> These numbers come from our own runs with QBBC, 200 000 events each. Near 45–48 MeV the result changes very fast with energy, because that's where 10 mm of aluminium just about stops the protons.

---

[← Setting up the agent](07-agent-setup.md) · [Agenda](00-agenda.md)
