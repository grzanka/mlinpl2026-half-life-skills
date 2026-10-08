# Prerequisites

[← Agenda](00-agenda.md) · [Next: welcome & setup →](02-welcome-and-setup.md)

You can work in one of two places. Pick one:

| | **Ares (recommended)** | **Your laptop** |
|---|---|---|
| What runs where | Everything runs on the Ares cluster; your laptop is just a terminal | Everything runs on your laptop |
| What you install | An SSH client (you probably have one already) | Terminal, git, Python, uv, a C++ toolchain, then Geant4 |
| Geant4 | Preinstalled | You install it ([Installing Geant4](03-install-geant4.md)) |
| Account | A tutorial account (e.g. `tutorial512` + password), handed out at the start of the session | None needed |

## Case 1: working on Ares

All you need is a terminal that can run `ssh`. Geant4, CMake, git and the compilers are already on Ares. The extra tools, uv and opencode, you'll install on Ares during the tutorial, each with a single command ([uv](02-welcome-and-setup.md#install-uv-ares-only), [opencode](06-opencode-setup.md)).

| Your system | Terminal to use | `ssh` included? |
|---|---|---|
| Linux | Any terminal (GNOME Terminal, Konsole, …) | Yes. If not, `sudo apt-get install openssh-client` |
| macOS | Terminal (in Applications → Utilities) or iTerm2 | Yes |
| Windows 10/11 | [Windows Terminal](https://aka.ms/terminal) or PowerShell | Yes, the OpenSSH client is built in |

Check that it works. It should print a version, something like `OpenSSH_9.6`:

```bash
ssh -V
```

> On Windows, if `ssh` isn't found, enable it under *Settings → System → Optional features → OpenSSH Client*.

That's it. You'll log in at the start of the session: [Log in to Ares](02-welcome-and-setup.md#log-in-to-ares-ares-only).

## Case 2: working on your laptop

Supported: **Linux** and **macOS** (Intel or Apple Silicon). On **Windows**, install [WSL2 with Ubuntu](https://learn.microsoft.com/windows/wsl/install) and follow the Ubuntu instructions inside the Ubuntu terminal.

### What you need

| Tool | Why | Check it with |
|---|---|---|
| Terminal | Every step of the tutorial is a command | — |
| git | To clone this repository and [geant4-ai](https://github.com/CTPPS/geant4-ai) (which also brings the Geant4 source) | `git --version` |
| curl | Downloads installers and the Geant4 physics data | `curl --version` |
| Python ≥ 3.10 | The geant4-ai helper scripts: plots, GDML and macro validation, reading `.root` files | `python3 --version` |
| [uv](https://docs.astral.sh/uv/) | Installs the Python dependencies of the helper scripts (pyg4ometry, uproot, numpy, matplotlib…) | `uv --version` |
| C++17 compiler | Every Geant4 simulation is a C++ program you compile | `c++ --version` |
| CMake ≥ 3.16 and make | Build system for Geant4 and the simulations | `cmake --version`, `make --version` |
| xerces-c and expat (headers) | XML parsing; xerces-c is needed for **GDML** geometry files, which the agent uses. Only needed if you [compile Geant4 from source](03-install-geant4.md#option-b-compile-from-source) | — |
| A coding agent | [opencode](https://opencode.ai), the terminal version, installed in [Installing opencode](06-opencode-setup.md). Claude Code also works | `opencode --version` or `claude --version` |

Then there's **Geant4 itself**, which has its own page: [Installing Geant4](03-install-geant4.md) (about 2 GB to download). If you install Geant4 with conda (Option A), the conda environment brings its own compiler, CMake and make. You still need git, curl, Python and uv.

**Hardware and disk:** at least 8 GB of RAM and 5–10 GB of free disk space. More CPU cores means faster simulations. Details: [Installing Geant4 → Before you start](03-install-geant4.md#before-you-start).

### Install the tools

Pick your system.

**Ubuntu / Debian / WSL2:**

```bash
sudo apt-get update
```

```bash
sudo apt-get install -y git curl python3 build-essential cmake libexpat1-dev libxerces-c-dev
```

**Fedora / RHEL / Rocky / Alma:**

```bash
sudo dnf install -y git curl python3 gcc-c++ make cmake expat-devel xerces-c-devel
```

**macOS:**

1. Install the Apple command-line tools, which provide git, the clang C++ compiler and make (a dialog pops up; click *Install*):

   ```bash
   xcode-select --install
   ```

2. Install CMake and xerces-c from [Homebrew](https://brew.sh):

   ```bash
   brew install cmake xerces-c
   ```

> The `python3` that ships with the macOS command-line tools may be older than 3.10. That's fine: uv fetches a newer Python when it needs one.

**Then install uv (all systems):**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Open a **new terminal** so that `uv` is on your `PATH`.

### Check everything

Each command should print a version and no error:

```bash
git --version && curl --version | head -1 && python3 --version && uv --version && c++ --version | head -1 && cmake --version | head -1 && make --version | head -1
```

All good? Next: [install Geant4](03-install-geant4.md).

---

[← Agenda](00-agenda.md) · [Next: welcome & setup →](02-welcome-and-setup.md)
