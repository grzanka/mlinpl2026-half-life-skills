# Installing Geant4: get it and compile

[← Welcome & setup](02-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: test the installation →](04-test-geant4.md)

We use **Geant4 11.4.2**, released on 17 June 2026. It's the version installed on Ares, so laptops and the cluster run the same code. Everything on this page (the conda package, the source and the physics datasets) is pinned to this version.

> **On Ares? Skip this page.** Geant4 is already installed there. Go to [Test the installation](04-test-geant4.md).

Before you start, install the tools listed in [Prerequisites](01-prerequisites.md#case-2-working-on-your-laptop): at least git, curl, Python, uv and a terminal.

Each install downloads about 2 GB.

Run the commands one at a time, in the same terminal, and check that each one finishes without errors before running the next.

## Before you start

### Hardware

- **CPU:** Geant4 is CPU-hungry and multithreaded: it simulates particles in parallel on all your cores. With 10 or more cores you're in good shape. It makes **no use of the GPU**, so your GPU will sit idle this afternoon.
- **RAM:** 8 GB is enough to run simulations. Compiling from source on many cores needs about 1–2 GB per parallel job.

### Disk space and download size

Geant4 itself is small. The **physics datasets** are what take the space: tables of cross-sections, decay data and so on. Geant4 11.4.2 needs 12 of them by default:

| Dataset         | Download    | Unpacked    | What it holds                         |
|-----------------|-------------|-------------|---------------------------------------|
| G4NDL 4.7.1     | 1113 MB     | 1147 MB     | Neutron interactions below 20 MeV      |
| G4EMLOW 8.8     | 350 MB      | 740 MB      | Low-energy electromagnetic physics     |
| RealSurface 2.2 | 133 MB      | 133 MB      | Optical surface reflectance            |
| G4CHANNELING 2.0| 21 MB       | 71 MB       | Channeling in crystals                 |
| 8 smaller ones  | 34 MB       | 123 MB      | Decay, evaporation, cross-sections …   |
| **Total**       | **1.65 GB** | **2.2 GB**  |                                       |

What that means for each installation option:

| Option                   | Download | Disk space needed                                                       |
|--------------------------|----------|-------------------------------------------------------------------------|
| geant4-ai + Geant4 source (everyone) | 70 MB | 0.3 GB                                                    |
| A: conda                 | 2.0 GB   | about 5 GB, plus 2 GB of package cache (free it with `conda clean -a -y`) |
| B: compile from source   | 1.7 GB   | about 10 GB during the build, about 3 GB after you delete the build directory |

> The conda and build-directory disk figures are estimates. The download sizes and the dataset table are measured for Geant4 11.4.2.

## Step 1 (everyone): clone geant4-ai, which brings the Geant4 source

The geant4-ai toolkit we use in the afternoon searches your exact Geant4 source for UI commands, GDML tags and physics-list contents, instead of relying on its knowledge base or the model's memory. It finds the source through the `G4_SOURCE_DIR` variable. The conda package contains only compiled libraries and headers, so **you need the source even if you install with conda.**

The [geant4-ai repository](https://github.com/CTPPS/geant4-ai) ships the Geant4 11.4.2 source as a git submodule (`external/geant4`), so one clone gets you both the toolkit and the source.

**1. Clone geant4-ai into `~/geant4-ai`, with the Geant4 source (about 70 MB to download, 0.3 GB on disk):**

```bash
git clone --recurse-submodules=external/geant4 --shallow-submodules https://github.com/CTPPS/geant4-ai.git "$HOME/geant4-ai"
```

**2. Check that the source is there.** You should see directories such as `examples`, `source` and `cmake`:

```bash
ls "$HOME/geant4-ai/external/geant4"
```

> Already cloned geant4-ai without the submodule? Run `git -C "$HOME/geant4-ai" submodule update --init --depth 1 external/geant4`.

**3. Tell your shell where the tutorial files and the Geant4 source are.** `TUTORIAL_DIR` is the directory all later pages use; on a laptop it's your home directory. Use `~/.zshrc` instead of `~/.bashrc` on macOS:

```bash
echo 'export TUTORIAL_DIR="$HOME"' >> ~/.bashrc
```

```bash
echo 'export G4_SOURCE_DIR="$TUTORIAL_DIR/geant4-ai/external/geant4"' >> ~/.bashrc
```

## Step 2: install Geant4, picking one option

- **Option A: conda (recommended).** Prebuilt binaries with no compiling. About 10 min on a good connection.
- **Option B: compile from source.** No conda needed. About 10 min of compiling on a 12-core laptop, 30 min on 4 cores.

### Option A: conda (Miniforge)

Uses [Miniforge](https://github.com/conda-forge/miniforge) and the conda-forge `geant4` package, which includes the physics datasets. Available for Linux (x86_64, aarch64) and macOS (Intel, Apple Silicon). On Windows, use WSL2 (Ubuntu).

> Already have conda or mamba? Skip steps 1–2 and use your own `conda` in step 3.

**1. Download the Miniforge installer:**

```bash
curl -fL -o /tmp/Miniforge3.sh "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
```

**2. Install Miniforge into `~/miniforge3`.** It asks no questions and doesn't touch your shell config:

```bash
bash /tmp/Miniforge3.sh -b -u -p "$HOME/miniforge3"
```

**3. Create an environment called `g4` with Geant4 11.4.2 (the same version as the source) and a compiler.** This is the long step, about 2 GB to download:

```bash
"$HOME/miniforge3/bin/conda" create -y -n g4 -c conda-forge geant4=11.4.2 cmake make cxx-compiler
```

**4. Optional: free 2 GB of downloaded package files:**

```bash
"$HOME/miniforge3/bin/conda" clean -a -y
```

Done. Go to [Test the installation](04-test-geant4.md).

### Option B: compile from source

#### B.1 Prerequisites

You need a C++17 compiler, CMake ≥ 3.16, `make`, and the expat and xerces-c XML libraries. If you followed [Prerequisites → Install the tools](01-prerequisites.md#install-the-tools), you already have them.

#### B.2 Configure, compile, install

This uses the source from [Step 1](#step-1-everyone-clone-geant4-ai-which-brings-the-geant4-source). The build goes into `~/geant4-ai/geant4/build`, the installation into `~/geant4-ai/geant4/install`. That `geant4/` directory is git-ignored in geant4-ai, so it never shows up as a change in the repository.

**1. Go to the geant4-ai directory:**

```bash
cd "$HOME/geant4-ai"
```

**2. Configure.** `GEANT4_INSTALL_DATA=ON` makes the build download the physics datasets (1.65 GB) for you. `GEANT4_USE_GDML=ON` enables GDML geometry files, which the geant4-ai toolkit relies on:

```bash
cmake -S external/geant4 -B geant4/build -DCMAKE_INSTALL_PREFIX="$HOME/geant4-ai/geant4/install" -DCMAKE_BUILD_TYPE=Release -DGEANT4_INSTALL_DATA=ON -DGEANT4_USE_GDML=ON
```

**3. Compile on all CPU cores.** This is the long step. It took 10.5 min on a laptop with a 12-core Intel Core Ultra 5 225U. That's about 110 min of CPU time in total, so expect roughly 15 min on 8 cores and 30 min on 4. It also downloads the physics datasets (1.65 GB) while it compiles, so it needs a working internet connection, and a slow connection makes it take longer:

```bash
cmake --build geant4/build -j "$(getconf _NPROCESSORS_ONLN)"
```

> If the build gets killed or your laptop freezes, you ran out of RAM. Rerun with fewer parallel jobs, e.g. `-j 4`. The build resumes where it stopped.

**4. Install into `~/geant4-ai/geant4/install`:**

```bash
cmake --install geant4/build
```

**5. Optional: delete the build directory** to free several GB. The installation doesn't need it:

```bash
rm -rf "$HOME/geant4-ai/geant4/build"
```

Done. Go to [Test the installation](04-test-geant4.md).

---

[← Welcome & setup](02-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: test the installation →](04-test-geant4.md)
