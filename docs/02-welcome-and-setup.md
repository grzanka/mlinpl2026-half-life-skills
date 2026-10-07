# Welcome & setup (14:00–14:15)

[← Prerequisites](01-prerequisites.md) · [Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](03-install-geant4.md)

By 14:15 you should have:

- [ ] a terminal on a machine with Geant4 (Ares, or your laptop)
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

## Install uv (Ares only)

The geant4-ai helper scripts need Python ≥ 3.10, but Ares only has Python 3.6. [uv](https://docs.astral.sh/uv/) fixes that: it installs into your home directory (no admin rights needed) and downloads a recent Python on its own when the toolkit needs one. Laptop users installed it with the [prerequisites](01-prerequisites.md#install-the-tools).

**1. Install uv into `~/.local/bin`:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**2. Check it.** It should print a version:

```bash
uv --version
```

## Get the repositories (Ares and laptop)

**1. Clone this repository:**

```bash
git clone https://github.com/grzanka/mlinpl2026-half-life-skills.git "$HOME/mlinpl2026-half-life-skills"
```

**2. Clone geant4-ai, with the Geant4 11.4.2 source as a submodule.** Laptop users who followed [Installing Geant4, Step 1](03-install-geant4.md#step-1-everyone-clone-geant4-ai-which-brings-the-geant4-source) already have it and can skip steps 2–3:

```bash
git clone --recurse-submodules=external/geant4 --shallow-submodules https://github.com/CTPPS/geant4-ai.git "$HOME/geant4-ai"
```

**3. Tell your shell where the Geant4 source is.** Use `~/.zshrc` instead of `~/.bashrc` on macOS:

```bash
echo 'export G4_SOURCE_DIR="$HOME/geant4-ai/external/geant4"' >> ~/.bashrc
```

**4. Load it into the current terminal:**

```bash
source ~/.bashrc
```

## Activate and check Geant4 (Ares and laptop)

Follow [Test the installation](04-test-geant4.md). On Ares, step 6 there (building example B1) is optional. At minimum, `geant4-config --version` has to work.

## The agent

We start the agent after the first simulation, which we do by hand. Setup instructions: [Setting up the agent](06-agent-setup.md).

---

[← Prerequisites](01-prerequisites.md) · [Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](03-install-geant4.md) · [Skip to: test the installation →](04-test-geant4.md)
