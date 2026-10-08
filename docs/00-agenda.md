# Agenda

**Half-Life Skills: Driving Real Particle-Physics Simulations with a Coding Agent**
Tutorial 10, ML in PL 2026 · Sunday, 11 October 2026, 14:00–18:00 · Leszek Grzanka, Kamil Milewski

> Build a fallout shelter, melt a snowman for water, irradiate a cockroach for dinner.

## Plan of the day

Four hours with one coffee break. The times are targets, and the mission block takes up any slack.

| Time        | Block                                                  | What you do                                                                                              | You're done when                                             |
|-------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| 14:00–14:15 | [Welcome & setup](02-welcome-and-setup.md)             | **Ares:** log in, get a compute node and clone the repositories ([setup](02-welcome-and-setup.md)), then [test](04-test-geant4.md). **Laptop:** [install](03-install-geant4.md), then [test](04-test-geant4.md) | `geant4-config --version` works |
| 14:15–14:45 | [Geant4 by hand](05-first-simulation.md) (no AI)       | What Geant4 is; geometry, physics, beam and scoring; run the example in this repo, change one parameter, rerun | You've run a simulation and found its Bragg peak             |
| 14:45–15:45 | [Agent setup](07-agent-setup.md) and [worked example: shielding](08-shielding-demo.md) | Install [opencode](06-opencode-setup.md), set up the geant4-ai toolkit and connect it to the PLGrid models. Then build a simulation together, stage by stage: does 1 cm of aluminium give more or less dose than 1 mm? | You've explained why the thicker shield gives more dose |
| 15:45–16:00 | ☕ Break                                                |                                                                                                          |                                                              |
| 16:00–17:15 | [Mission menu](09-mission-menu.md) (pick one)          | Shelter, snowman or cockroach. Hunt failure modes. Ground the agent on real sources. Run heavier jobs on the cluster. | One plot, plus one "the agent got this wrong and here's how we caught it" story |
| 17:15–17:40 | [Agent as explorer](13-agent-as-explorer.md)           | Point the agent at the results, not the code: parameter scans, sanity checks, visualisation              | One extra plot or table you didn't ask for in the mission     |
| 17:40–18:00 | [Q&A](14-qa.md)                                        | Questions about anything from the afternoon: Geant4, the agent, Ares and PLGrid, using this on your own problem | You've asked what you wanted to ask                          |

## Missions

| Mission                     | Question                                                                                     | What to check against                                     |
|-----------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| [🏠 Fallout shelter](10-mission-fallout-shelter.md) | How thick must a concrete, soil or lead wall be to cut fallout γ dose (Cs-137 662 keV; Co-60 1.17/1.33 MeV) by 10× or 1000×? | Half- and tenth-value layers; NIST XCOM attenuation        |
| [⛄ Snowman → water](11-mission-snowman.md) | How much energy does a particle beam deposit in a block of snow, and how long would it take to melt 1 L? | Heat of fusion 334 J/g; energy conservation of the beam   |
| [🪳 Cockroach at the LHC](12-mission-cockroach.md) | What dose does a ~1 g water-equivalent target get next to a beam loss in the tunnel?          | Order-of-magnitude estimates; LD50 ~1 kGy for a cockroach vs. ~4 Gy for a human |

## Pages

1. [Prerequisites](01-prerequisites.md)
2. [Welcome & setup](02-welcome-and-setup.md)
3. [Installing Geant4: get it and compile](03-install-geant4.md) (skip this on Ares)
4. [Installing Geant4: test the installation](04-test-geant4.md)
5. [First simulation: proton beam in water](05-first-simulation.md)
6. [Installing opencode](06-opencode-setup.md)
7. [Setting up the agent: the geant4-ai toolkit](07-agent-setup.md)
8. [Worked example: does more shielding mean less dose?](08-shielding-demo.md)
9. [Mission menu](09-mission-menu.md): [fallout shelter](10-mission-fallout-shelter.md), [snowman](11-mission-snowman.md), [cockroach](12-mission-cockroach.md)
10. [Agent as explorer](13-agent-as-explorer.md)
11. [Q&A](14-qa.md)

---

[Next: Prerequisites →](01-prerequisites.md)
