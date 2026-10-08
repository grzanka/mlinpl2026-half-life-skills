# Setting up the agent: the geant4-ai toolkit (14:45)

[← Installing opencode](06-opencode-setup.md) · [Agenda](00-agenda.md)

The geant4-ai toolkit turns a general coding agent (opencode or Claude Code) into a Geant4 assistant. It provides a knowledge base, templates, helper scripts, an application skeleton, and slash commands such as `/g4-new`.

One script, `bootstrap.sh`, sets everything up. It creates a working directory, installs the agent layer for the tool you choose, and copies in the toolkit files. It doesn't compile anything.

## 1. Before you start

> **On Ares:** work on your compute node, not the login node. Not sure where you are, or opened a new terminal? See [Before you start](04-test-geant4.md#0-before-you-start).

Geant4 must be activated in this terminal, and `G4_SOURCE_DIR` must point to the Geant4 source (see [Test the installation](04-test-geant4.md)).

opencode must be installed ([Installing opencode](06-opencode-setup.md)); `opencode --version` should print `opencode v2.…`.

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

The workspace is where the agent writes each simulation: its code, build and output. Output can reach gigabytes, so on Ares it goes to `$SCRATCH`, the scratch filesystem: much faster than your home directory, and much larger. On a cluster, `bootstrap.sh` refuses a workspace inside `$HOME`.

**1. Run the bootstrap script.** It asks which tool you use; answer opencode (or Claude Code, if you use that). The workspace goes into `$TUTORIAL_DIR`, which is `$SCRATCH` on Ares:

```bash
bash scripts/bootstrap.sh "$TUTORIAL_DIR/g4work"
```

**2. Enter the workspace:**

```bash
cd "$TUTORIAL_DIR/g4work"
```

> Tutorial accounts on Ares stay active for only a few days after the tutorial, and then everything in them is gone. Copy anything you want to keep to your own computer before then (see [copying files from Ares](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)).

## 4. Connect opencode to the PLGrid models

opencode doesn't know about PLGrid Forge out of the box. A small plugin adds it, with all its models, and a few settings pick the default model. Both are in this repository, in [`opencode/`](../opencode/); they come from [groundnuty/plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode). We install them **only in this workspace**: opencode started anywhere else stays as it was.

> Using Claude Code instead of opencode? Skip to [Start the agent](#5-start-the-agent).

**1. Add the PLGrid provider to the workspace.** The script copies the plugin into `.opencode/plugins/` and adds the default model to the workspace's `opencode.json`, keeping the permissions `bootstrap.sh` put there:

```bash
bash "$TUTORIAL_DIR/mlinpl2026-half-life-skills/opencode/add-plgrid.sh" "$TUTORIAL_DIR/g4work"
```

**2. Log in with your API key.** Run this inside the workspace (you're there after step 3), because that's where opencode now knows PLGrid. opencode asks for the key; paste it and press Enter. It's stored in `~/.local/share/opencode/opencode.db`, never in this repository:

<!-- TODO: how participants get their LLM Lab API key (tutorial grant? keys handed out with the Ares logins?). -->

**TODO:** how to get your API key for the tutorial.

```bash
opencode auth login plgrid
```

**3. Check that the models are there.** This should list about 20 models, each starting with `plgrid/`. If it prints nothing, run it once more:

```bash
opencode models | grep '^plgrid/'
```

**4. Ask the model something.** This sends one prompt and prints the answer, without starting the full interface:

```bash
opencode run "Reply with one word: ready"
```

If it answers, opencode is ready. If you get *"not available for grant"*, your key can't use that model; see [Which model](#which-model).

## 5. Start the agent

Start opencode in the workspace, or run `claude` instead if you chose Claude Code:

```bash
opencode
```

Type a question and press Enter. A few keys worth knowing:

| Key or command | What it does |
|---|---|
| `/models` | Switch model |
| **Tab** | Switch agent (`build` can edit files and run commands, `plan` only reads) |
| `/exit` or **Ctrl+C** | Quit |

opencode asks before it runs a command or edits a file. Read what it wants to do before you approve it: that's the habit this whole afternoon is about.

As a first test, ask:

> What version of Geant4 is installed here? Check it with a command; don't guess.

The agent should run `geant4-config --version` instead of answering from memory. That's the habit we'll build on all afternoon.

## 6. Start a simulation

`/g4-new` starts the pipeline. It needs to know what to simulate, so follow it with a plain-language description of the study. For our worked example:

```text
/g4-new "150 MeV protons into a 20 x 20 x 40 cm water phantom, score energy deposit in 1 mm slices along the beam, 10000 events, local run."
```

Approve each stage as the agent goes: geometry, physics, beam, scoring, compile, run, plot. At the end, compare the range with the result you got by hand in the [first simulation](05-first-simulation.md).

## Which model

The default is `deepseek-ai/DeepSeek-V4.1-Flash`: the fastest of the reliable models. Others, all switchable with `/models`:

| Model | Notes |
|---|---|
| `deepseek-ai/DeepSeek-V4.1-Flash` | Default. Fast and reliable with tools, but only some grants can use it |
| `Qwen/Qwen3.6-27B` | Every grant can use it. Reliable with tools, a bit slower |
| `google/gemma-4-31B` | Every grant can use it; used for short background tasks such as session titles |

If DeepSeek answers *"not available for grant"*, make Qwen your default: in the workspace's `opencode.json`, change the `model` line to `"model": "plgrid/Qwen/Qwen3.6-27B"`.

Several other models in the list can't use tools at all, so they can't run commands or edit files. Measured comparisons of all of them are in [plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode/blob/main/research/models.md).

---

[← Installing opencode](06-opencode-setup.md) · [Agenda](00-agenda.md)
