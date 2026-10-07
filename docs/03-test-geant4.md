# Installing Geant4: test the installation

[← Install Geant4](02-install-geant4.md) · [Agenda](00-agenda.md) · [Next: first simulation →](04-first-simulation.md)

Run these checks in a **new terminal**, so that the changes made during installation take effect.

## 1. Activate Geant4

Geant4 isn't a single program. It's a set of libraries plus about 2 GB of physics data. Before using it, you **activate** it in your terminal, which sets a few environment variables. Repeat the activation in every new terminal. Use the command that matches your installation.

**Ares:**

```bash
module load geant4/11.4.2
```

**Conda (Option A):**

```bash
source "$HOME/miniforge3/bin/activate" g4
```

**Compiled from source (Option B):**

```bash
source "$HOME/geant4/install/bin/geant4.sh"
```

> To activate automatically, add that line to `~/.bashrc` (Linux) or `~/.zshrc` (macOS).

## 2. Look at what activation set

List the Geant4-related environment variables:

```bash
env | grep -E '^G4|GEANT4' | sort
```

You should see the following:

- **One `G4…DATA` variable per physics dataset.** Geant4 reads these to find its data at run time, so they matter: if one is missing or points to the wrong place, the simulation stops with a "dataset not found" error, or silently runs without that piece of physics.

  | Variable            | Dataset             | Used for                                |
  |---------------------|---------------------|-----------------------------------------|
  | `G4NEUTRONHPDATA`   | G4NDL               | Neutron interactions below 20 MeV        |
  | `G4LEDATA`          | G4EMLOW             | Low-energy electromagnetic physics       |
  | `G4LEVELGAMMADATA`  | PhotonEvaporation   | Gamma emission from excited nuclei       |
  | `G4RADIOACTIVEDATA` | RadioactiveDecay    | Radioactive decay                        |
  | `G4PARTICLEXSDATA`  | G4PARTICLEXS        | Hadron and ion cross-sections            |
  | `G4ENSDFSTATEDATA`  | G4ENSDFSTATE        | Nuclear level properties                 |
  | `G4INCLDATA`, `G4ABLADATA`, `G4PIIDATA`, `G4SAIDXSDATA`, `G4REALSURFACEDATA`, `G4CHANNELINGDATA` | the smaller ones | Specialised models |

- **`GEANT4_SOURCE_DIR`**, which you set in [Step 1 of the installation](02-install-geant4.md#step-1-everyone-get-the-geant4-source-code). The geant4-ai toolkit uses it to find the Geant4 sources. On Ares, the `module load` sets it for you. <!-- TODO: make the Ares module set GEANT4_SOURCE_DIR -->

Activation also adds Geant4's `bin` directory to `PATH`, so that `geant4-config` works. On Linux, the source-build activation script also extends `LD_LIBRARY_PATH` so programs can find the Geant4 libraries; on macOS it's `DYLD_LIBRARY_PATH`.

## 3. Check the version

It should print `11.4.2`:

```bash
geant4-config --version
```

## 4. Check the physics datasets

Prints nothing if all datasets are in place:

```bash
geant4-config --check-datasets
```

## 5. Check the source code

You should see directories such as `examples`, `source` and `cmake`:

```bash
ls "$GEANT4_SOURCE_DIR"
```

## 6. Build and run an example shipped with Geant4

This is the real end-to-end test. It compiles example B1 from the Geant4 sources against your installation, then runs it.

**1. Configure the example:**

```bash
cmake -S "$GEANT4_SOURCE_DIR/examples/basic/B1" -B "$HOME/geant4/B1-build"
```

**2. Compile it:**

```bash
cmake --build "$HOME/geant4/B1-build" -j "$(getconf _NPROCESSORS_ONLN)"
```

**3. Go to the build directory:**

```bash
cd "$HOME/geant4/B1-build"
```

**4. Run it on all your cores.** It should finish in seconds, ending with a summary of the dose deposited in the scoring volume:

```bash
G4FORCENUMBEROFTHREADS="$(getconf _NPROCESSORS_ONLN)" ./exampleB1 run1.mac
```

> Watch `htop` (or Activity Monitor on macOS) while it runs. Geant4 uses one thread per core, and it's all CPU: the GPU stays idle.

All six checks pass? You're ready. Go to the [first simulation](04-first-simulation.md).

---

[← Install Geant4](02-install-geant4.md) · [Agenda](00-agenda.md) · [Next: first simulation →](04-first-simulation.md)
