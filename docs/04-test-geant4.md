# Installing Geant4: test the installation

[← Install Geant4](03-install-geant4.md) · [Agenda](00-agenda.md) · [Next: first simulation →](05-first-simulation.md)

Run these checks in a **new terminal**, so that the changes made during installation take effect.

## 1. Activate Geant4

Geant4 isn't a single program. It's a set of libraries plus about 2 GB of physics data. Before using it, you **activate** it in your terminal, which sets a few environment variables. Repeat the activation in every new terminal. Use the command that matches your installation.

**Ares:** load Geant4, CMake (Ares has no `cmake` by default) and a recent Python (the default `python3` is 3.6). All three are built with the same GCC 14.3 toolchain:

```bash
module load geant4/11.4.2 cmake/3.31.8-gcccore-14.3.0 python/3.13.5-gcccore-14.3.0
```

**Conda (Option A):**

```bash
source "$HOME/miniforge3/bin/activate" g4
```

**Compiled from source (Option B):**

```bash
source "$HOME/geant4-ai/geant4/install/bin/geant4.sh"
```

> Like `tutorial-env.sh`, activation lasts only until you close the terminal. Repeat it in every new terminal, and on Ares after every `srun`.

## 2. Look at what activation set

List the Geant4-related environment variables:

```bash
env | grep -E '^G4|GEANT4' | sort
```

You should see the following:

- **Where the physics datasets are.** Geant4 reads this at run time, so it matters: if a dataset can't be found, the simulation stops with a "dataset not found" error, or silently runs without that piece of physics.

  | Variable            | Dataset             | Used for                                |
  |---------------------|---------------------|-----------------------------------------|
  | `G4NEUTRONHPDATA`   | G4NDL               | Neutron interactions below 20 MeV        |
  | `G4LEDATA`          | G4EMLOW             | Low-energy electromagnetic physics       |
  | `G4LEVELGAMMADATA`  | PhotonEvaporation   | Gamma emission from excited nuclei       |
  | `G4RADIOACTIVEDATA` | RadioactiveDecay    | Radioactive decay                        |
  | `G4PARTICLEXSDATA`  | G4PARTICLEXS        | Hadron and ion cross-sections            |
  | `G4ENSDFSTATEDATA`  | G4ENSDFSTATE        | Nuclear level properties                 |
  | `G4INCLDATA`, `G4ABLADATA`, `G4PIIDATA`, `G4SAIDXSDATA`, `G4REALSURFACEDATA`, `G4CHANNELINGDATA` | the smaller ones | Specialised models |

  - **Laptop (conda or source build): one `G4…DATA` variable per dataset**, as in the table above.
  - **Ares: a single `GEANT4_DATA_DIR`** pointing to the directory that holds all the datasets (on Ares, `/net/software/testing/data/Geant4-data/11.4`). When a dataset has no variable of its own, Geant4 looks for it there. You'll also see `G4INSTALL`, `G4LIB`, `G4INCLUDE` and some `EB…` variables set by the Ares module system; you can ignore them.

  Either way, [step 4](#4-check-the-physics-datasets) checks that Geant4 actually finds every dataset.

- **`G4_SOURCE_DIR`**, pointing to `$TUTORIAL_DIR/geant4-ai/external/geant4`. It comes from `tutorial-env.sh` ([In every new terminal](02-welcome-and-setup.md#in-every-new-terminal)), not from Geant4 activation. The geant4-ai toolkit uses it to find the Geant4 source.

Activation also adds Geant4's `bin` directory to `PATH`, so that `geant4-config` works. On Linux, the source-build activation script also extends `LD_LIBRARY_PATH` so programs can find the Geant4 libraries; on macOS it's `DYLD_LIBRARY_PATH`.

## 3. Check the version

It should print `11.4.2`:

```bash
geant4-config --version
```

The geant4-ai toolkit also needs GDML support. This should print `yes`:

```bash
geant4-config --has-feature gdml
```

## 4. Check the physics datasets

**Laptop (conda or source build).** This prints one line per dataset, and every line should say `INSTALLED`:

```bash
geant4-config --check-datasets
```

**Ares.** There, `geant4-config --check-datasets` reports every dataset as `NOTFOUND`. That's a false alarm: it only looks in the directory Geant4 was compiled with, while Ares keeps the data in `$GEANT4_DATA_DIR`, where Geant4 finds it at run time. Check that directory instead; every line should say `OK`:

```bash
for p in $(geant4-config --check-datasets | awk '{print $3}'); do d=$(basename "$p"); [ -d "$GEANT4_DATA_DIR/$d" ] && echo "$d OK" || echo "$d MISSING"; done
```

## 5. Check the source code

You should see directories such as `examples`, `source` and `cmake`:

```bash
ls "$G4_SOURCE_DIR"
```

## 6. Build and run an example shipped with Geant4

This is the real end-to-end test. It compiles example B1 from the Geant4 sources against your installation, then runs it.

**1. Configure the example:**

```bash
cmake -S "$G4_SOURCE_DIR/examples/basic/B1" -B "$TUTORIAL_DIR/geant4-ai/geant4/B1-build"
```

**2. Compile it:**

```bash
cmake --build "$TUTORIAL_DIR/geant4-ai/geant4/B1-build" -j "$(getconf _NPROCESSORS_ONLN)"
```

**3. Go to the build directory:**

```bash
cd "$TUTORIAL_DIR/geant4-ai/geant4/B1-build"
```

**4. Run it on all your cores.** It should finish in seconds, ending with a summary of the dose deposited in the scoring volume:

```bash
G4FORCENUMBEROFTHREADS="$(getconf _NPROCESSORS_ONLN)" ./exampleB1 run1.mac
```

> Watch `htop` (or Activity Monitor on macOS) while it runs. Geant4 uses one thread per core, and it's all CPU: the GPU stays idle.

All six checks pass? You're ready. Go to the [first simulation](05-first-simulation.md).

---

[← Install Geant4](03-install-geant4.md) · [Agenda](00-agenda.md) · [Next: first simulation →](05-first-simulation.md)
