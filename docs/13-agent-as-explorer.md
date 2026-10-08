# Agent as explorer (17:15–17:40)

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md) · [Next: Q&A →](14-qa.md)

So far the agent has **written** code: geometry, macros, the application. Now point it at your **results** instead. A finished run is a small dataset, and an agent that can read files, run scripts and do arithmetic is a decent research assistant for it, as long as you keep checking what it tells you.

**You're done when** you have one extra plot or table that you didn't ask for in your mission.

## Where your results are

Each run lives in its own directory in your workspace, `runs/<id>/`:

| File or directory | What's in it |
|---|---|
| `SimSpec.yaml` | The approved plan: geometry, beam, physics, scoring, events |
| `geometry.gdml`, `*.mac` | The geometry and the macros that ran |
| `output/` | Raw results: `.root` files and CSV dumps of scoring meshes |
| `analysis/` | Plots, if you asked for any |
| `EXPLANATION.md` | The agent's write-up of the run |
| `run.sh` | Reruns everything without the agent: `./run.sh`, `./run.sh smoke`, `./run.sh plots` |

Start opencode in your workspace as usual ([how](09-mission-menu.md#how-to-work-through-a-mission)), then paste the prompts below. They use `/g4`, the command for one task or question. Replace `<id>` with your run's directory name (`ls runs` lists them).

## 1. Understand what you have

```text
/g4 Look at runs/<id>/output and tell me what each file contains: which quantities, in which units, how many bins or entries, and which numbers in it answer my mission question. Don't make new plots yet.
```

```text
/g4 Read runs/<id>/EXPLANATION.md and runs/<id>/SimSpec.yaml. List every assumption the run makes that a physicist might disagree with, most important first.
```

## 2. Sanity checks

Ask the agent to check its own results against something independent. Make it show the calculation, not just the verdict.

```text
/g4 Check energy conservation for runs/<id>: compare the total energy deposited in all scored volumes with the total energy of the primaries. Show the numbers and say what fraction is unaccounted for and where it most likely went.
```

```text
/g4 Estimate the main result of runs/<id> by hand, with a back-of-the-envelope formula and reference data you can cite (NIST tables, PDG, the Geant4 source). Compare it with the simulation and explain any difference larger than a factor of 2.
```

```text
/g4 What is the statistical uncertainty of the main result in runs/<id>? How many more events would I need to halve it, and how long would that take on 6 cores?
```

## 3. Parameter scans

Change **one** thing and rerun, without rebuilding the application if only the macro changes:

```text
/g4 Using the existing app in runs/<id>, rerun with <parameter> set to <value 1>, <value 2> and <value 3>, one run each, and make a table of the main result versus <parameter>. Tell me the run time first, and ask before starting anything longer than 10 minutes.
```

Ideas for each mission:

| Mission | Scan |
|---|---|
| 🏠 [Fallout shelter](10-mission-fallout-shelter.md) | Wall material (concrete, lead, iron, water) at a fixed thickness, or the source energy (662 keV, 1.17 MeV, 1.33 MeV) |
| ⛄ [Snowman](11-mission-snowman.md) | Proton energy 100–400 MeV, or snow density 0.1–0.6 g/cm³ |
| 🪳 [Cockroach](12-mission-cockroach.md) | Distance from the beam axis (50 cm, 1 m, 2 m), or the collimator material (tungsten, copper, carbon) |

## 4. Look at it differently

```text
/g4 Make a plot from runs/<id> that I haven't asked for but that would help me understand the result, and explain in two sentences what it shows. Save it as PNG in runs/<id>/analysis.
```

```text
/g4 Which particles carry the energy that reaches my detector in runs/<id>? If the current output can't tell, propose the smallest change to the scoring that would, and how long the rerun would take.
```

To see a plot made on Ares, copy it to your laptop ([how](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)). To look at the geometry again, paste `runs/<id>/geometry.gdml` into the [GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/).

## Keep it honest

An explorer is only useful if you can trust what it reports. While you work:

- **Ask where every number comes from.** A file and a line, a script output, a cited table. "Typically about…" is not a source.
- **Recompute one number yourself.** Pick one value from the agent's table and check it with `cat`, a calculator, or the CSV.
- **Watch for invented data.** If the agent "remembers" a reference value, ask it to find it in a file or a table you can open.
- **Never let it edit the raw output.** The toolkit never modifies the `.root` files it produces; if the agent wants to change anything in `output/`, say no and ask it to write a new file instead.

Bring the most surprising thing you found, or the best "the agent got this wrong" story, to the [Q&A](14-qa.md).

---

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md) · [Next: Q&A →](14-qa.md)
