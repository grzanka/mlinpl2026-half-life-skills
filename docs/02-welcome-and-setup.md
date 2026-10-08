# Welcome & setup (14:00–14:15)

[← Prerequisites](01-prerequisites.md) · [Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](03-install-geant4.md)

By 14:15 you should have:

- [ ] a terminal on a machine with Geant4 (an Ares compute node, or your laptop)
- [ ] a copy of this repository
- [ ] a copy of [geant4-ai](https://github.com/CTPPS/geant4-ai), with the Geant4 source in it

## Where to work

- **Ares (recommended).** Geant4 is preinstalled, so there's nothing to install. Tutorial accounts (login and password) are handed out at the start of the session. You only need an SSH client: [Prerequisites → Ares](01-prerequisites.md#case-1-working-on-ares).
- **Your laptop.** Works on Linux and macOS (Intel or Apple Silicon). On Windows, use WSL2 (Ubuntu). Install the [prerequisites](01-prerequisites.md#case-2-working-on-your-laptop) and [Geant4](03-install-geant4.md) first.

## Log in to Ares (Ares only)

At the start of the session you get a tutorial account: a login such as `tutorial512` (your number will differ) and a password. Log in with your own login in place of `tutorial512`:

```bash
ssh tutorial512@ares.cyfronet.pl
```

Type the password when asked. Nothing appears on screen while you type it; that's normal. On the first login, `ssh` asks whether you trust the host's key: type `yes`.

## Get a compute node (Ares only)

<!-- TODO: srun below verified on 2026-10-08 with a tutorial account (job allocated on ac0766).
     Still to check: outbound internet from compute nodes (git clone, uv installer, uv python downloads, llmlab.plgrid.pl). -->

After logging in you're on the Ares **login node**, which everyone shares, so don't compile or run simulations there. Instead, ask Slurm for your own slice of a compute node: 6 CPU cores for 4 hours, enough for the whole tutorial.

```bash
srun --partition=cpu --nodes=1 --ntasks=1 --cpus-per-task=6 --time=4:00:00 --pty bash -l
```

What the options mean:

| Option | Meaning |
|---|---|
| `--partition=cpu` | The group of CPU nodes the tutorial accounts may use |
| `--nodes=1 --ntasks=1` | One process on one node |
| `--cpus-per-task=6` | 6 CPU cores for you; Geant4 will use all of them |
| `--time=4:00:00` | 4 hours (hours:minutes:seconds); after that the session ends. Careful: `--time=4` would mean 4 minutes |
| `--pty bash -l` | An interactive shell on the node, set up like a fresh login |

Slurm first prints `queued and waiting for resources`, then `has been allocated resources`. When the prompt changes from `login01` to a compute node name such as `ac0766`, you're there. Do everything from here on there, including installing uv and cloning the repositories.

> If you close the terminal or lose the SSH connection, the session ends; log in again and rerun `srun`. Your files (in your home directory and in `$SCRATCH`) are kept. To leave the compute node yourself, type `logout`: you're back on `login01`, and the 6 cores are free for someone else.

## Install uv (Ares only)

The geant4-ai helper scripts need Python ≥ 3.10 and a few Python packages (matplotlib, uproot, numpy…). Python itself comes from an Ares module, which you load when you [activate Geant4](04-test-geant4.md#1-activate-geant4). The packages come through [uv](https://docs.astral.sh/uv/), the same tool laptop users installed with the [prerequisites](01-prerequisites.md#install-the-tools). It installs into your home directory, with no admin rights needed.

**1. Install uv into `~/.local/bin`.** That directory is already on your `PATH` on Ares, so `--no-modify-path` tells the installer to leave your shell configuration alone:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh -s -- --no-modify-path
```

**2. Check it.** It should print a version:

```bash
uv --version
```

## Get the repositories (Ares and laptop)

> Laptop users who followed [Installing Geant4, Step 1](03-install-geant4.md#step-1-everyone-clone-geant4-ai-which-brings-the-geant4-source) already cloned geant4-ai; skip step 3.

**1. Choose where the tutorial files go.** We keep that place in a variable, `TUTORIAL_DIR`, which later commands use. It's set only in this terminal; nothing is written to your shell configuration.

On Ares, use `$SCRATCH`, the scratch filesystem. It's much faster than your home directory, which matters when you compile code and when simulations write their output. It's also much larger, so builds and results won't fill it up:

```bash
export TUTORIAL_DIR="$SCRATCH"
```

On a laptop, use your home directory:

```bash
export TUTORIAL_DIR="$HOME"
```

> Tutorial accounts on Ares stay active for only a few days after the tutorial, and then everything in them is gone. Copy anything you want to keep to your own computer before then (see [copying files from Ares](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)).

**2. Clone this repository:**

```bash
git clone https://github.com/grzanka/mlinpl2026-half-life-skills.git "$TUTORIAL_DIR/mlinpl2026-half-life-skills"
```

**3. Clone geant4-ai, with the Geant4 11.4.2 source as a submodule:**

```bash
git clone --recurse-submodules=external/geant4 --shallow-submodules https://github.com/CTPPS/geant4-ai.git "$TUTORIAL_DIR/geant4-ai"
```

**4. Set the tutorial's environment.** [`tutorial-env.sh`](../tutorial-env.sh) sets `TUTORIAL_DIR` and `G4_SOURCE_DIR` (where the Geant4 source is, for the geant4-ai toolkit) and prints them:

```bash
source "$TUTORIAL_DIR/mlinpl2026-half-life-skills/tutorial-env.sh"
```

### In every new terminal

These settings last only until you close the terminal, so nothing stays behind after the tutorial. In every new terminal, and on Ares after every `srun`, run the line for your machine, then [activate Geant4](04-test-geant4.md#1-activate-geant4).

On Ares:

```bash
source "$SCRATCH/mlinpl2026-half-life-skills/tutorial-env.sh"
```

On a laptop:

```bash
source "$HOME/mlinpl2026-half-life-skills/tutorial-env.sh"
```

## Activate and check Geant4 (Ares and laptop)

Follow [Test the installation](04-test-geant4.md). On Ares, step 6 there (building example B1) is optional. At minimum, `geant4-config --version` has to work.

## The agent

We start the agent after the first simulation, which we do by hand. Setup instructions: [Setting up opencode](06-opencode-setup.md), then [Setting up the agent](07-agent-setup.md).

---

[← Prerequisites](01-prerequisites.md) · [Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](03-install-geant4.md) · [Skip to: test the installation →](04-test-geant4.md)
