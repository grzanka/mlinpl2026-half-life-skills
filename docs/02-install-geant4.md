# Installing Geant4 on your laptop

[← Welcome & setup](01-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: first simulation →](03-first-simulation.md)

> **On Ares? Skip this page.** Geant4 is already installed there.

Two options:

- **Option A: conda (recommended).** Prebuilt binaries. No compiling, about 10–20 min, ~5 GB of disk.
- **Option B: build from source.** No conda needed. Takes 30–90 min of compiling depending on your CPU, plus ~2 GB of physics data, ~8 GB of disk during the build.

Do it **before** the tutorial if you can. Conference Wi-Fi will not love 40 people downloading physics datasets at once.

Run the commands one at a time, in the same terminal, and check each one finishes without errors before running the next.

### Option A: conda (Miniforge)

Uses [Miniforge](https://github.com/conda-forge/miniforge) and the conda-forge `geant4` package, which includes the physics datasets. Available for Linux (x86_64, aarch64) and macOS (Intel, Apple Silicon).

> Already have conda or mamba? Skip steps 1–2 and use your own `conda` in step 3.

**1. Download the Miniforge installer:**

```bash
curl -fL -o /tmp/Miniforge3.sh "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
```

**2. Install Miniforge into `~/miniforge3`** (no questions asked, does not touch your shell config):

```bash
bash /tmp/Miniforge3.sh -b -u -p "$HOME/miniforge3"
```

**3. Create an environment called `g4` with Geant4, a compiler and plotting tools** (the long step):

```bash
"$HOME/miniforge3/bin/conda" create -y -n g4 -c conda-forge geant4 cmake make cxx-compiler python matplotlib numpy
```

**4. Activate the environment.** Repeat this in every new terminal:

```bash
source "$HOME/miniforge3/bin/activate" g4
```

**5. Check the version.** It should print e.g. `11.4.3`:

```bash
geant4-config --version
```

**6. Check that all physics datasets are present.** No output means everything is in place:

```bash
geant4-config --check-datasets
```

### Option B: build from source

#### B.1 Prerequisites

You need a C++17 compiler, CMake ≥ 3.16, `make` and the expat XML library. Pick your system:

**Ubuntu / Debian / WSL2:**

```bash
sudo apt-get update
```

```bash
sudo apt-get install -y build-essential cmake libexpat1-dev curl python3-matplotlib python3-numpy
```

**Fedora / RHEL / Rocky / Alma:**

```bash
sudo dnf install -y gcc-c++ make cmake expat-devel curl python3-matplotlib python3-numpy
```

**macOS:** install the Apple command-line tools (a dialog pops up, click *Install*):

```bash
xcode-select --install
```

then CMake from [Homebrew](https://brew.sh):

```bash
brew install cmake
```

#### B.2 Download, build, install

Everything goes into `~/geant4`: the source, the build directory and the final installation in `~/geant4/install`.

**1. Create the working directory and enter it:**

```bash
mkdir -p "$HOME/geant4" && cd "$HOME/geant4"
```

**2. Download the Geant4 11.4.3 source (~50 MB):**

```bash
curl -fL -O https://geant4-data.web.cern.ch/releases/geant4-v11.4.3.tar.gz
```

**3. Unpack it:**

```bash
tar xzf geant4-v11.4.3.tar.gz
```

**4. Configure.** `GEANT4_INSTALL_DATA=ON` makes the build download the physics datasets (~2 GB) for you:

```bash
cmake -S geant4-v11.4.3 -B build -DCMAKE_INSTALL_PREFIX="$HOME/geant4/install" -DCMAKE_BUILD_TYPE=Release -DGEANT4_INSTALL_DATA=ON
```

**5. Compile on all CPU cores** (the long step, 30–90 min):

```bash
cmake --build build -j "$(getconf _NPROCESSORS_ONLN)"
```

> If the build gets killed or your laptop freezes, you ran out of RAM. Rerun with fewer cores, e.g. `-j 2`. The build resumes where it stopped.

**6. Install into `~/geant4/install`:**

```bash
cmake --install build
```

**7. Set up the environment.** Repeat this in every new terminal:

```bash
source "$HOME/geant4/install/bin/geant4.sh"
```

> To make it permanent, add that line to `~/.bashrc` (Linux) or `~/.zshrc` (macOS).

**8. Check the version.** It should print `11.4.3`:

```bash
geant4-config --version
```

**9. Check that all physics datasets are present.** No output means everything is in place:

```bash
geant4-config --check-datasets
```

#### B.3 Smoke test: build and run example B1

**1. Configure the example against your installation:**

```bash
cmake -S "$HOME/geant4/geant4-v11.4.3/examples/basic/B1" -B "$HOME/geant4/B1-build"
```

**2. Compile it:**

```bash
cmake --build "$HOME/geant4/B1-build" -j "$(getconf _NPROCESSORS_ONLN)"
```

**3. Run it in batch mode.** It should end with a summary of the dose deposited in the scoring volume:

```bash
cd "$HOME/geant4/B1-build" && ./exampleB1 run1.mac
```

---

[← Welcome & setup](01-welcome-and-setup.md) · [Agenda](00-agenda.md) · [Next: first simulation →](03-first-simulation.md)
