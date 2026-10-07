# First simulation: proton beam in water (14:15–14:45)

[← Test the installation](04-test-geant4.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](06-agent-setup.md)

No AI in this part. We run a Geant4 simulation by hand first, so that later you can see what the agent is doing on your behalf.

## What Geant4 is, in one paragraph

Geant4 is a C++ toolkit from CERN that simulates particles passing through matter, one particle at a time, using Monte-Carlo methods. You describe the **geometry** (what's where, made of what), choose a **physics list** (which interactions to model), define a **beam** (particle, energy, position, direction) and add **scoring** (what to measure). Geant4 then tracks each particle and all its secondaries until they stop or leave the world.

## The example in this repo

[`examples/water-phantom`](../examples/water-phantom/) is a 20 × 20 × 40 cm block of water in air. A beam of protons enters it head-on. This is the standard setup used to commission proton-therapy beams.

| Ingredient | Where it's set                                                                                                   |
|------------|------------------------------------------------------------------------------------------------------------------|
| Geometry   | [`water_phantom.cc`](../examples/water-phantom/water_phantom.cc): water box, front face at z = 0                  |
| Physics    | `QBBC` by default, or override it with `PHYSLIST=...`                                                             |
| Beam       | [`run.mac`](../examples/water-phantom/run.mac): `/gps/...` commands                                               |
| Scoring    | [`run.mac`](../examples/water-phantom/run.mac): `/score/...` commands, energy deposit in 1 mm slices along the beam |

You only ever edit `run.mac`. The C++ stays as it is.

## Build and run

Run these from the repository root, with Geant4 activated ([how to activate it](02-welcome-and-setup.md)).

**1. Configure the build:**

```bash
cmake -S examples/water-phantom -B build/water-phantom
```

**2. Compile:**

```bash
cmake --build build/water-phantom
```

**3. Go to the build directory:**

```bash
cd build/water-phantom
```

**4. Run 10 000 protons** (from a few seconds to a minute). It writes `depth_dose.csv`:

```bash
./water_phantom ../../examples/water-phantom/run.mac
```

**5. Get the result.** This prints the Bragg peak position and the range. If you have matplotlib installed, it also saves a plot, `depth_dose.png`:

```bash
python3 ../../examples/water-phantom/plot.py depth_dose.csv
```

## Check against the textbook

The NIST [PSTAR](https://physics.nist.gov/PhysRefData/Star/Text/PSTAR.html) database gives the CSDA range of protons in water: the average distance a proton travels while slowing down. The R80 printed by `plot.py` should agree with it to within a few millimetres.

| Proton energy | PSTAR CSDA range in water |
|---------------|---------------------------|
| 70 MeV        | 4.08 cm                   |
| 100 MeV       | 7.72 cm                   |
| 150 MeV       | 15.77 cm                  |
| 200 MeV       | 25.96 cm                  |

> Expect Geant4 to come out a millimetre or two short of PSTAR. That's not a bug: Geant4's `G4_WATER` uses a mean excitation energy of 78 eV, while PSTAR uses 75 eV. A deviation like this is a physics question, not a code question. Keep it in mind for when the agent starts producing numbers.

## Exercise: change one thing and rerun

Edit `examples/water-phantom/run.mac` (for example with `nano`), then repeat step 4 and step 5 from inside `build/water-phantom`. You don't need to recompile, because only the macro changed.

1. Change `/gps/energy 150 MeV` to `100 MeV`. Does the peak move to about 7.7 cm?
2. Change `/gps/particle proton` to `e-`. Where did the Bragg peak go?
3. Run again with a different physics list. Does the range change?

   ```bash
   PHYSLIST=QGSP_BIC_EMZ ./water_phantom ../../examples/water-phantom/run.mac
   ```

---

[← Test the installation](04-test-geant4.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](06-agent-setup.md)
