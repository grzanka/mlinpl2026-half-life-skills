# Agenda

**Half-Life Skills: Driving Real Particle-Physics Simulations with a Coding Agent**
Tutorial 10, ML in PL 2026 · Sunday, 11 October 2026, 14:00–18:00 · Leszek Grzanka, Kamil Milewski

> Build a fallout shelter, melt a snowman for water, irradiate a cockroach for dinner.

## Plan of the day

Four hours with one coffee break. The times are targets, and the mission block takes up any slack.

| Time        | Block                                                  | What you do                                                                                              | You're done when                                             |
|-------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| 14:00–14:15 | [Welcome & setup](01-welcome-and-setup.md)             | Log in to Ares or check your laptop install ([install](02-install-geant4.md), [test](03-test-geant4.md)), get an LLM Lab token, start the agent | `geant4-config --version` works and the agent answers         |
| 14:15–14:45 | [Geant4 by hand](04-first-simulation.md) (no AI)       | What Geant4 is; geometry, physics, beam and scoring; run the example in this repo, change one parameter, rerun | You've run a simulation and plotted its depth–dose curve      |
| 14:45–15:45 | Worked example: beam in water, with the agent          | Drive the agent stage by stage (geometry → physics → beam → scoring → compile → run → plot), approving each step | Your Bragg peak position agrees with NIST PSTAR               |
| 15:45–16:00 | ☕ Break                                                |                                                                                                          |                                                              |
| 16:00–17:10 | Mission menu (pick one, teams of 2–3)                  | Shelter, snowman or cockroach. Hunt failure modes. Ground the agent on real sources. Run heavier jobs on the cluster. | One plot, plus one "the agent got this wrong and here's how we caught it" story |
| 17:10–17:35 | Agent as explorer                                      | Point the agent at the results, not the code: parameter scans, sanity checks, visualisation              | One extra plot or table you didn't ask for in the mission     |
| 17:35–18:00 | Debrief                                                | Each team reports for 2 min: failure-mode gallery, where human approval paid off, take-home checklist    | A shared list of failure modes and fixes                     |

## Missions

| Mission                     | Question                                                                                     | What to check against                                     |
|-----------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| 🏠 Fallout shelter          | How thick must a concrete, soil or lead wall be to cut fallout γ dose (Cs-137 662 keV; Co-60 1.17/1.33 MeV) by 10× or 1000×? | Half- and tenth-value layers; NIST XCOM attenuation        |
| ⛄ Snowman → water          | How much energy does a particle beam deposit in a block of snow, and how long would it take to melt 1 L? | Heat of fusion 334 J/g; energy conservation of the beam   |
| 🪳 Cockroach at the LHC     | What dose does a ~1 g water-equivalent target get next to a beam loss in the tunnel?          | Order-of-magnitude estimates; LD50 ~1 kGy for a cockroach vs. ~4 Gy for a human |

## Pages

1. [Welcome & setup](01-welcome-and-setup.md)
2. [Installing Geant4: get it and compile](02-install-geant4.md) (skip this on Ares)
3. [Installing Geant4: test the installation](03-test-geant4.md)
4. [First simulation: proton beam in water](04-first-simulation.md)

---

[Next: Welcome & setup →](01-welcome-and-setup.md)
