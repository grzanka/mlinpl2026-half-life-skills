# Welcome & setup (14:00–14:15)

[← Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](02-install-geant4.md)

By 14:15 you should have:

- [ ] a terminal on a machine with Geant4 (Ares, or your laptop)
- [ ] a copy of this repository
- [ ] an LLM Lab token
- [ ] a running agent that answers a prompt

## Where to work

- **Ares (recommended).** Geant4 is preinstalled, so there's nothing to install. Accounts are handed out at the start of the session.
- **Your laptop.** Works on Linux and macOS (Intel or Apple Silicon). On Windows, use WSL2 (Ubuntu). Install Geant4 first: [Installing Geant4 on your laptop](02-install-geant4.md).

## On Ares

**1. Log in** (replace `plgLOGIN` with the login you were given):

```bash
ssh plgLOGIN@ares.cyfronet.pl
```

**2. Load Geant4:**

```bash
module load geant4  # TODO: confirm module name/version on Ares
```

**3. Check that it works.** It should print a version number:

```bash
geant4-config --version
```

## On your laptop

**1. Activate Geant4.** Use the line that matches how you installed it.

If you installed with conda:

```bash
source "$HOME/miniforge3/bin/activate" g4
```

If you built it from source:

```bash
source "$HOME/geant4/install/bin/geant4.sh"
```

**2. Check that it works:**

```bash
geant4-config --version
```

## Get this repository (both Ares and laptop)

**1. Clone it:**

```bash
git clone https://github.com/grzanka/mlinpl2026-half-life-skills.git
```

**2. Enter it:**

```bash
cd mlinpl2026-half-life-skills
```

## LLM Lab token and the agent

<!-- TODO: which agent, how to get the LLM Lab token, how to point the agent at the DeepSeek endpoint on PLGrid -->

**TODO:** steps for getting your token, setting it in the environment, and starting the agent.

As a test, ask the agent:

> What version of Geant4 is installed here? Check it with a command; don't guess.

The agent should run `geant4-config --version` instead of answering from memory. That's the habit we'll build on all afternoon.

---

[← Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](02-install-geant4.md) · [Skip to: first simulation →](03-first-simulation.md)
