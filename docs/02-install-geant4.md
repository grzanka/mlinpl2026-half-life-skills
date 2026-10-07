# Installing Geant4: get it and compile

[← Welcome & setup](01-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: test the installation →](03-test-geant4.md)

> **On Ares? Skip this page.** Geant4 is already installed there. Go to [Test the installation](03-test-geant4.md).

**Please do this at home, before the tutorial.** Each install downloads about 2 GB.

Run the commands one at a time, in the same terminal, and check that each one finishes without errors before running the next.

## Before you start

### Hardware

- **CPU:** Geant4 is CPU-hungry and multithreaded: it simulates particles in parallel on all your cores. With 10 or more cores you're in good shape. It makes **no use of the GPU**, so your GPU will sit idle this afternoon.
- **RAM:** 8 GB is enough to run simulations. Compiling from source on many cores needs about 1–2 GB per parallel job.

### Disk space and download size

Geant4 itself is small. The **physics datasets** are what take the space: tables of cross-sections, decay data and so on. Geant4 11.4.3 needs 12 of them by default:

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
| Geant4 source (everyone) | 38 MB    | 0.2 GB                                                                  |
| A: conda                 | 2.0 GB   | about 5 GB, plus 2 GB of package cache (free it with `conda clean -a -y`) |
| B: compile from source   | 1.7 GB   | about 10 GB during the build, about 3 GB after you delete the build directory |

> The conda and build-directory disk figures are estimates. The download sizes and the dataset table are measured for Geant4 11.4.3.

## Step 1 (everyone): get the Geant4 source code

The geant4-ai toolkit we use in the afternoon reads the Geant4 source code: the C++ files, the examples and the macros. The agent looks things up there instead of relying on its memory. The conda package contains only compiled libraries and headers, so **you need the source even if you install with conda.**

**1. Create a directory for Geant4 and enter it:**

```bash
mkdir -p "$HOME/geant4" && cd "$HOME/geant4"
```

**2. Download the Geant4 11.4.3 source (38 MB):**

```bash
curl -fL -O https://geant4-data.web.cern.ch/releases/geant4-v11.4.3.tar.gz
```

**3. Unpack it into `~/geant4/geant4-v11.4.3`:**

```bash
tar xzf geant4-v11.4.3.tar.gz
```

**4. Tell your shell where the source is.** Use `~/.zshrc` instead of `~/.bashrc` on macOS:

```bash
echo 'export GEANT4_SOURCE_DIR="$HOME/geant4/geant4-v11.4.3"' >> ~/.bashrc
```

<!-- TODO: align variable name with what the geant4-ai toolkit expects -->

## Step 2: install Geant4, picking one option

- **Option A: conda (recommended).** Prebuilt binaries with no compiling. About 10 min on a good connection.
- **Option B: compile from source.** No conda needed. About 15–25 min of compiling on 10+ cores.

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

**3. Create an environment called `g4` with Geant4 11.4.3 (the same version as the source) and a compiler.** This is the long step, about 2 GB to download:

```bash
"$HOME/miniforge3/bin/conda" create -y -n g4 -c conda-forge geant4=11.4.3 cmake make cxx-compiler
```

**4. Optional: free 2 GB of downloaded package files:**

```bash
"$HOME/miniforge3/bin/conda" clean -a -y
```

Done. Go to [Test the installation](03-test-geant4.md).

### Option B: compile from source

#### B.1 Prerequisites

You need a C++17 compiler, CMake ≥ 3.16, `make` and the expat XML library. Pick your system:

**Ubuntu / Debian / WSL2:**

```bash
sudo apt-get update
```

```bash
sudo apt-get install -y build-essential cmake libexpat1-dev curl
```

**Fedora / RHEL / Rocky / Alma:**

```bash
sudo dnf install -y gcc-c++ make cmake expat-devel curl
```

**macOS:** install the Apple command-line tools (a dialog pops up; click *Install*):

```bash
xcode-select --install
```

then install CMake from [Homebrew](https://brew.sh):

```bash
brew install cmake
```

#### B.2 Configure, compile, install

This uses the source from [Step 1](#step-1-everyone-get-the-geant4-source-code). The build goes into `~/geant4/build`, the installation into `~/geant4/install`.

**1. Go to the Geant4 directory:**

```bash
cd "$HOME/geant4"
```

**2. Configure.** `GEANT4_INSTALL_DATA=ON` makes the build download the physics datasets (1.65 GB) for you:

```bash
cmake -S geant4-v11.4.3 -B build -DCMAKE_INSTALL_PREFIX="$HOME/geant4/install" -DCMAKE_BUILD_TYPE=Release -DGEANT4_INSTALL_DATA=ON
```

**3. Compile on all CPU cores.** This is the long step, about 15–25 min on 10+ cores:

```bash
cmake --build build -j "$(getconf _NPROCESSORS_ONLN)"
```

> If the build gets killed or your laptop freezes, you ran out of RAM. Rerun with fewer parallel jobs, e.g. `-j 4`. The build resumes where it stopped.

**4. Install into `~/geant4/install`:**

```bash
cmake --install build
```

**5. Optional: delete the build directory** to free several GB. The installation doesn't need it:

```bash
rm -rf "$HOME/geant4/build"
```

Done. Go to [Test the installation](03-test-geant4.md).

---

[← Welcome & setup](01-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: test the installation →](03-test-geant4.md)
