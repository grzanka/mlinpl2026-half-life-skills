# First simulation: proton beam in water (14:15–14:45)

[← Test the installation](04-test-geant4.md) · [Agenda](00-agenda.md) · [Next: set up opencode →](06-opencode-setup.md)

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

Geant4 must be activated in this terminal ([how to activate it](04-test-geant4.md#1-activate-geant4)).

**1. Go to this repository:**

```bash
cd "$TUTORIAL_DIR/mlinpl2026-half-life-skills"
```

**2. Configure the build:**

```bash
cmake -S examples/water-phantom -B build/water-phantom
```

**3. Compile:**

```bash
cmake --build build/water-phantom
```

**4. Go to the build directory:**

```bash
cd build/water-phantom
```

**5. Run 10 000 protons** (from a few seconds to a minute). It writes `depth_dose.csv`:

```bash
./water_phantom ../../examples/water-phantom/run.mac
```

**6. Get the result.** This prints the Bragg peak position and the range, and saves a plot, `depth_dose.png`. `uv run` gives the script a recent Python with matplotlib, so it works the same on Ares and on your laptop:

```bash
uv run --with matplotlib python ../../examples/water-phantom/plot.py depth_dose.csv
```

> Without uv, plain `python3 ../../examples/water-phantom/plot.py depth_dose.csv` also works: it prints the numbers and skips the plot if matplotlib is missing.

### On Ares: copy the plot to your computer

The plot is saved on Ares, and you can't open an image over SSH. Copy it to your own computer instead.

**1. On Ares, print the full path of the build directory.** You're still in `build/water-phantom`:

```bash
pwd
```

It prints something like `/…/tutorial512/mlinpl2026-half-life-skills/build/water-phantom`, inside your `$SCRATCH`. Copy that line.

**2. On your computer, copy the files.** Open a **new terminal on your computer**, not the one logged in to Ares. In the commands below, replace `tutorial512` with your login and `PATH_FROM_STEP_1` with the line you copied. You'll be asked for your Ares password.

**With scp** (Linux, macOS, and Windows PowerShell). It copies one file into the current directory, which the trailing `.` stands for:

```bash
scp tutorial512@ares.cyfronet.pl:PATH_FROM_STEP_1/depth_dose.png .
```

**With rsync** (Linux, macOS, WSL2). It's handy for copying many files, for example all the plots from a run, and on repeated runs it only transfers new or changed files. This copies every `.png` and `.svg` from the build directory into `ares-plots/` on your computer:

```bash
rsync -av --include='*/' --include='*.png' --include='*.svg' --exclude='*' tutorial512@ares.cyfronet.pl:PATH_FROM_STEP_1/ ./ares-plots/
```

Then open the files as usual.

> Compute nodes and the login node see the same files, so anything you create in a compute-node session can be copied this way.

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

Edit `examples/water-phantom/run.mac` (for example with `nano`), then repeat step 5 and step 6 from inside `build/water-phantom`. You don't need to recompile, because only the macro changed.

1. Change `/gps/energy 150 MeV` to `100 MeV`. Does the peak move to about 7.7 cm?
2. Change `/gps/particle proton` to `e-`. Where did the Bragg peak go?
3. Run again with a different physics list. Does the range change?

   ```bash
   PHYSLIST=QGSP_BIC_EMZ ./water_phantom ../../examples/water-phantom/run.mac
   ```

---

[← Test the installation](04-test-geant4.md) · [Agenda](00-agenda.md) · [Next: set up opencode →](06-opencode-setup.md)
