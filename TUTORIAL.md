# Half-Life Skills — Tutorial 10, ML in PL 2026

**Driving Real Particle-Physics Simulations with a Coding Agent**
Sunday, 11 October 2026, 14:00–18:00 · Leszek Grzanka, Kamil Milewski

> Build a fallout shelter, melt a snowman for water, irradiate a cockroach for dinner.

---

## Schedule

Four hours, one coffee break. Times are targets; the mission block absorbs any slack.

| Time          | Block                                   | What participants do                                                                                   | Output / checkpoint                                         |
|---------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| 14:00–14:15   | **0. Welcome & setup**                  | Log in to Ares (or check laptop install), receive LLM Lab token, start the agent, say "hello"         | `geant4-config --version` works; agent answers a prompt     |
| 14:15–14:45   | **1. Geant4 by hand** (no AI)           | What Geant4 is; anatomy of a simulation (geometry, physics list, source, scoring); run a prepared example with a macro, change one parameter, rerun | Everyone has run one simulation and seen its output         |
| 14:45–15:45   | **2. Worked example: beam in water**    | Drive the agent stage by stage: geometry → physics → beam → scoring → compile → run → plot. Approve each step. | Depth–dose curve; Bragg-peak position vs. NIST PSTAR range  |
| 15:45–16:00   | ☕ **Break**                             |                                                                                                        |                                                             |
| 16:00–17:10   | **3. Mission menu** (pick one, teams of 2–3) | Shelter wall / snowman / cockroach. Hunt failure modes: invented commands, non-existent materials, wrong units. Ground the agent on the Geant4 docs and NIST data. Heavier runs to the cluster via DeepSeek on PLGrid hardware. | One plot + one "the agent got this wrong, here's how we caught it" story per team |
| 17:10–17:35   | **4. Agent as explorer**                | Point the agent at the results (not the code): parameter scans, sanity checks, visualisation           | One extra plot or table that the team did not ask for in block 3 |
| 17:35–18:00   | **5. Debrief**                          | Teams report (2 min each), failure-mode gallery, where human approval paid off, take-home checklist    | Shared list of failure modes and fixes                      |

### Missions (block 3)

| Mission                    | Physics question                                                                 | Known reference to check against                         |
|----------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------|
| 🏠 **Fallout shelter**     | How thick must a concrete / soil / lead wall be to cut fallout γ dose (Cs-137, 662 keV; Co-60, 1.17/1.33 MeV) by 10×, 1000×? | Half-value / tenth-value layers, NIST XCOM attenuation    |
| ⛄ **Snowman → water**     | Energy deposited by a particle beam in a block of snow; how long to melt 1 L?    | Heat of fusion 334 J/g; energy conservation of the beam   |
| 🪳 **Cockroach at the LHC** | Dose to a ~1 g water-equivalent target next to a beam loss in the tunnel         | Order-of-magnitude dose estimates; cockroach LD50 ~ 1 kGy vs. human ~ 4 Gy |

---

## Where to work

- **Ares (recommended)** — Geant4 prebuilt, nothing to install. Accounts and tokens handed out at 14:00.
- **Your laptop** — Linux or macOS (Intel or Apple Silicon). On Windows, use WSL2 (Ubuntu) and follow the Linux path inside it.

## Installing Geant4 on your laptop

Uses [Miniforge](https://github.com/conda-forge/miniforge) and the conda-forge `geant4` package, which includes the physics datasets. Needs ~5 GB of disk and 10–20 min on a decent connection. Do it **before** the tutorial if you can — conference Wi-Fi will not love 40 people downloading datasets at once.

Copy-paste the whole block into a terminal:

```bash
curl -fsSL -o /tmp/Miniforge3.sh "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh" && bash /tmp/Miniforge3.sh -b -u -p "$HOME/miniforge3" && "$HOME/miniforge3/bin/conda" create -y -n g4 -c conda-forge geant4 cmake make cxx-compiler python matplotlib numpy && "$HOME/miniforge3/bin/conda" run -n g4 geant4-config --version
```

The last thing it prints should be a Geant4 version number (e.g. `11.4.3`). Then, in every new terminal, activate the environment:

```bash
source "$HOME/miniforge3/bin/activate" g4
```

Check that all physics datasets are present:

```bash
geant4-config --check-datasets
```

No output means everything is in place.

> If you already use conda/mamba, skip the Miniforge part: `conda create -y -n g4 -c conda-forge geant4 cmake make cxx-compiler python matplotlib numpy`.

---

## TODO

- [ ] Block 1: pick the hand-run example (B1? a minimal water-phantom app?) and write the macro walk-through
- [ ] Block 2: stage-by-stage prompts and the approval checkpoints; reference Bragg-peak values
- [ ] Block 3: mission briefs, starter prompts, reference values, known failure modes to seed
- [ ] Ares: module names, `srun`/`sbatch` templates, how to reach DeepSeek via LLM Lab
- [ ] Agent setup instructions (which agent, how to point it at the LLM Lab endpoint)
- [ ] Test the laptop install on Linux x86_64, macOS arm64, WSL2
