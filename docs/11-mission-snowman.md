# Mission: snowman → water ⛄

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md)

> **A proton beam hits a snowman. How much of the beam's energy stays in the snow, and how long would it take to melt 1 litre of water out of it?**

A beam deposits energy along its path, and most of that energy ends up as heat. Heat melts snow. The physics part is how much energy **stays** in the snowman (some leaves as neutrons and gamma rays, or with protons that fly straight through); the rest is energy bookkeeping you can check by hand.

**Predict first.** Is a faster beam always better at melting the snowman? If you could pick the proton energy, which would you pick?

## The setup

```text
  front view                         side view (beam goes left to right, along z)

        ( head )   r = 12 cm, y = 112 cm
      (  middle  ) r = 20 cm, y = 80 cm
   (     bottom    ) r = 30 cm, y = 30 cm     protons →  (   bottom   )
                                              150 MeV     pencil beam through its centre
  ───────────── ground (not simulated) ─────
```

Snow is not in Geant4's material database. Packed snow is ice with air in between, so we define it as water at a lower density: **0.4 g/cm³**.

## Option A: guided prompt

```text
/g4-new "Mission: snowman. A particle beam hits a snowman. How much of the beam energy stays in the snow, and how long would it take to melt 1 litre of water out of it? Propose the snowman (sizes, snow density and how to define snow as a material), the particle, its energy, the beam current, and what to score; explain each choice in one sentence and ask me before building. Keep the first run under a few minutes on 6 cores."
```

Before approving, ask yourself: is the particle stopped inside the snowman, or does it fly through? Where does the agent take the snow density from? Does it plan to check that energy is conserved?

## Option B: full prompt

```text
/g4-new "Snowman melting. World: air, 3 x 3 x 3 m. Snow: define a custom material Snow as water (H2O) with density 0.4 g/cm3. Snowman: three snow spheres stacked along +y, all at x = z = 0: bottom radius 30 cm centred at y = 30 cm, middle radius 20 cm centred at y = 80 cm, head radius 12 cm centred at y = 112 cm, so the spheres just touch. Beam: 150 MeV protons, a pencil beam along +z through the centre of the bottom sphere (x = 0, y = 30 cm), starting at z = -50 cm. Physics list QBBC. Score the total energy deposited in each sphere separately. 100000 events, local run. Output: the energy deposited per proton in each sphere in MeV and as a fraction of the beam energy. Then, for a 1 nA beam, the power deposited in the snowman in W, and how long it takes to melt 1 kg of snow (1 litre of water) starting at -5 C, using the specific heat of ice 2.1 J/(g K) and the heat of fusion 334 J/g; repeat the time for a 1 uA beam. Show the formulas you used."
```

The run takes a few seconds on 6 cores.

## What to check

| Stage | Check |
|---|---|
| Materials | Snow is a **custom** material: water composition, density 0.4 g/cm³ (not `G4_WATER` at 1 g/cm³, and not ice at 0.92) |
| Geometry | Three spheres that **touch but don't overlap**: the bottom one ends at y = 60 cm where the middle one starts, and the middle one ends at y = 100 cm where the head starts. The overlap check must be clean |
| Beam | Pencil beam at y = 30 cm, starting **outside** the snowman |
| Scoring | Energy per sphere, in MeV, summed over all particles |
| Results | Energy per proton ≤ 150 MeV (energy conservation!), almost all of it in the bottom sphere |

## Check against

From our own run (Geant4 11.4.2, QBBC, the Option B setup, 100 000 protons):

| Sphere | Energy per proton | Fraction of 150 MeV |
|---|---|---|
| Bottom | 144.5 MeV | 96.3 % |
| Middle | 0.009 MeV | 0.01 % |
| Head | 0.0005 MeV | < 0.01 % |

The 3.7 % that is missing leaves the snowman, mostly as neutrons and gamma rays from nuclear interactions.

Melting, by hand:

| Quantity | Value |
|---|---|
| Heat to warm 1 kg of snow from −5 °C to 0 °C | 1000 g × 2.1 J/(g K) × 5 K = 10.5 kJ |
| Heat to melt it | 1000 g × 334 J/g = 334 kJ |
| Total | ≈ 345 kJ |
| Power at 1 nA | 144.5 MV × 10⁻⁹ A ≈ 0.145 W |
| Time at 1 nA | 345 kJ / 0.145 W ≈ 2.4 × 10⁶ s ≈ **28 days** |
| Time at 1 µA | ≈ 2400 s ≈ **40 minutes** |

(A proton of 144.5 MeV deposited, arriving 6.2 × 10⁹ times per second at 1 nA, gives 144.5 × 10⁶ eV × 1.6 × 10⁻¹⁹ J/eV × 6.2 × 10⁹ s⁻¹ ≈ 0.145 W.)

And the answer to "predict first": the energy left per proton **peaks around 200 MeV** and then falls, because faster protons go right through the 60 cm ball (their range in snow, 15.8 cm of water ÷ 0.4 at 150 MeV, grows fast with energy):

| Proton energy | Left in the bottom ball | Fraction |
|---|---|---|
| 100 MeV | 97.8 MeV | 97.8 % |
| 150 MeV | 144.5 MeV | 96.3 % |
| 200 MeV | 156 MeV | 78.0 % |
| 250 MeV | 121 MeV | 48.3 % |
| 400 MeV | 93 MeV | 23.2 % |

## Failure modes to hunt

- **Overlapping snowballs.** In a real snowman the balls are pressed into each other, but Geant4 doesn't allow overlapping volumes: particles in the overlap are tracked in only one of them. If the agent stacks the balls with their centres too close, the overlap check should catch it; make sure it ran.
- **Snow as water.** Using `G4_WATER` (1 g/cm³) changes where the protons stop, though not much the energy left behind. Ask the agent why the density matters at all.
- **More energy than the beam.** Deposited energy per proton above 150 MeV means a scoring bug, for example counting the same energy in two overlapping scorers.
- **Melting the whole snowman.** 1 kg of snow is a small part of the bottom ball (about 45 kg). Ask what it would take to melt all of it.
- **Unit slips.** nA vs µA, MeV vs J, seconds vs days: check the formulas the agent shows you.
- **Heat stays put?** Real snow would melt locally along the beam first, and some heat would leave. Ask the agent which assumptions its time estimate makes.

## Going further

- Run the energy scan yourself: 100, 150, 200, 250, 400 MeV. Where is the optimum for your snowman?
- Try **electrons** (10 MeV, like a medical linac) or **gamma rays**. How much stays in the snow?
- Make the snow fluffier (0.1 g/cm³) or icier (0.6 g/cm³). How does the best proton energy move?

---

[← Mission menu](09-mission-menu.md) · [Agenda](00-agenda.md) · [Next mission: cockroach →](12-mission-cockroach.md)
