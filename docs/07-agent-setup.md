# Setting up the agent: the geant4-ai toolkit (14:45)

[← Setting up opencode](06-opencode-setup.md) · [Agenda](00-agenda.md)

The geant4-ai toolkit turns a general coding agent (opencode or Claude Code) into a Geant4 assistant. It provides a knowledge base, templates, helper scripts, an application skeleton, and slash commands such as `/g4-new`.

One script, `bootstrap.sh`, sets everything up. It creates a working directory, installs the agent layer for the tool you choose, and copies in the toolkit files. It doesn't compile anything.

## 1. Before you start

Geant4 must be activated in this terminal, and `G4_SOURCE_DIR` must point to the Geant4 source (see [Test the installation](04-test-geant4.md)).

**1. Check the Geant4 version.** It should print `11.4.2`:

```bash
geant4-config --version
```

**2. Check the source path.** It should list `examples`, `source` and `cmake`:

```bash
ls "$G4_SOURCE_DIR"
```

Without `G4_SOURCE_DIR` the toolkit still works, but it can only rely on its knowledge base. With it set, the agent checks UI commands, GDML tags and physics-list contents against your exact Geant4.

## 2. Go to the toolkit

You cloned geant4-ai during [setup](02-welcome-and-setup.md#get-the-repositories-ares-and-laptop). Enter its toolkit directory:

```bash
cd "$TUTORIAL_DIR/geant4-ai/toolkit"
```

## 3. Create your workspace

The workspace is where the agent writes each simulation: its code, build and output. Output can reach gigabytes, so on Ares it goes to `$SCRATCH`, the large scratch filesystem, rather than your small home directory. On a cluster, `bootstrap.sh` refuses a workspace inside `$HOME`.

**1. Run the bootstrap script.** It asks which tool you use; answer opencode (or Claude Code, if you use that). The workspace goes into `$TUTORIAL_DIR`, which is `$SCRATCH` on Ares:

```bash
bash scripts/bootstrap.sh "$TUTORIAL_DIR/g4work"
```

**2. Enter the workspace:**

```bash
cd "$TUTORIAL_DIR/g4work"
```

> `$SCRATCH` on Ares is cleaned automatically: files older than 30 days are removed. Copy anything you want to keep (see [copying files from Ares](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)).

## 4. Start the agent

opencode must already be installed and logged in to PLGrid ([Setting up opencode](06-opencode-setup.md)). Start it in the workspace, or run `claude` instead if you chose Claude Code:

```bash
opencode
```

As a first test, ask:

> What version of Geant4 is installed here? Check it with a command; don't guess.

The agent should run `geant4-config --version` instead of answering from memory. That's the habit we'll build on all afternoon.

## 5. Start a simulation

`/g4-new` starts the pipeline. It needs to know what to simulate, so follow it with a plain-language description of the study. For our worked example:

```text
/g4-new "150 MeV protons into a 20 x 20 x 40 cm water phantom, score energy deposit in 1 mm slices along the beam, 10000 events, local run."
```

Approve each stage as the agent goes: geometry, physics, beam, scoring, compile, run, plot. At the end, compare the range with the result you got by hand in the [first simulation](05-first-simulation.md).

---

[← Setting up opencode](06-opencode-setup.md) · [Agenda](00-agenda.md)
