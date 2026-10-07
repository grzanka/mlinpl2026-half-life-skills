# Welcome & setup (14:00–14:15)

[← Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](02-install-geant4.md)

By 14:15 you should have:

- [ ] a terminal on a machine with Geant4 (Ares, or your laptop)
- [ ] a copy of this repository

## Where to work

- **Ares (recommended).** Geant4 is preinstalled, so there's nothing to install. Accounts are handed out at the start of the session.
- **Your laptop.** Works on Linux and macOS (Intel or Apple Silicon). On Windows, use WSL2 (Ubuntu). Install Geant4 first: [Installing Geant4](02-install-geant4.md).

## Log in to Ares (Ares only)

Replace `plgLOGIN` with the login you were given:

```bash
ssh plgLOGIN@ares.cyfronet.pl
```

## Activate and check Geant4 (Ares and laptop)

Follow [Test the installation](03-test-geant4.md). On Ares, step 6 there (building example B1) is optional. At minimum, `geant4-config --version` has to work.

## Get this repository (both Ares and laptop)

**1. Clone it:**

```bash
git clone https://github.com/grzanka/mlinpl2026-half-life-skills.git
```

**2. Enter it:**

```bash
cd mlinpl2026-half-life-skills
```

## The agent

We start the agent after the first simulation, which we do by hand. Setup instructions: [Setting up the agent](05-agent-setup.md).

---

[← Agenda](00-agenda.md) · [Next: install Geant4 (laptop only) →](02-install-geant4.md) · [Skip to: test the installation →](03-test-geant4.md)
