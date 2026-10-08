# Setting up opencode with the PLGrid models

[← First simulation](05-first-simulation.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](07-agent-setup.md)

[opencode](https://opencode.ai) is the coding agent we use this afternoon. It runs in the terminal (a TUI, text user interface), so it works the same on your laptop and on Ares over SSH. We connect it to the open-weight models that ACK Cyfronet hosts for PLGrid (PLGrid Forge, at [llmlab.plgrid.pl](https://llmlab.plgrid.pl)), so your prompts and code stay on Polish academic infrastructure.

Do this both on a laptop and on Ares. On Ares, do it on your compute node ([Get a compute node](02-welcome-and-setup.md#get-a-compute-node-ares-only)).

## Which opencode: terminal or graphical, 1.x or 2.x

opencode comes in several forms, and it's easy to end up with a different one from everyone else. We use **the terminal app (TUI), version 2.x**.

**Terminal or graphical.** opencode ships as:

- **a terminal app (the TUI)**, started with `opencode`, plus `opencode run` for one-off prompts and scripts;
- **graphical apps**: a desktop app and a web interface.

We use **only the terminal app**. It's the only one that works over SSH on Ares, and the PLGrid setup below was built and tested in the terminal; the graphical apps weren't tested with it.

**1.x or 2.x.** Two release lines of opencode are currently maintained. 2.x came out on 11 September 2026; 1.x is still being released, with no end-of-support date announced. Which one you get depends on how you install it:

| | opencode 1.x | **opencode 2.x (we use this)** |
|---|---|---|
| Install with | `curl -fsSL https://opencode.ai/install \| bash`<br>or `npm install -g opencode-ai` | **`curl -fsSL https://opencode.ai/v2/install \| bash`**<br>or `brew install opencode` |
| `opencode --version` shows | `1.…` | `opencode v2.…` |
| Log in to PLGrid | `opencode providers login -p plgrid` | `opencode auth login plgrid` |
| Docs | [opencode.ai/docs](https://opencode.ai/docs/) | [opencode.ai/v2/docs](https://opencode.ai/v2/docs/) |

The PLGrid plugin works with both, but the commands on this page are for 2.x. If you already have opencode installed, check `opencode --version`. With 1.x, either install 2.x as below, or use the 1.x login command from the table. Things to know about 2.x:

- **It needs its own login.** If you used 1.x before, 2.x copies your PLGrid key the first time it runs. Otherwise, log in as in [step 3](#3-log-in-with-your-api-key); until then the PLGrid models don't appear.
- **It runs no language servers (LSP)**, so it doesn't get type-checker feedback after each edit the way 1.x can. That doesn't matter for this tutorial.
- **Our `opencode.json` is in the 1.x format**, which 2.x converts when it starts. If you edit it, keep that format: 1.x won't start with a config written in the 2.x format.

## 1. Install opencode

**1. Run the installer.** It puts `opencode` into `~/.opencode/bin`; no admin rights needed. `--no-modify-path` stops it from editing your shell configuration (`~/.bashrc` or `~/.zshrc`):

```bash
curl -fsSL https://opencode.ai/v2/install | bash -s -- --no-modify-path
```

> On macOS, `brew install opencode` works too. Don't use `npm install -g opencode-ai` or `https://opencode.ai/install` without `/v2`: those install 1.x.

**2. Put opencode on your `PATH` for this terminal.** [`tutorial-env.sh`](../tutorial-env.sh) does that whenever `~/.opencode/bin` exists, so rerun it now:

```bash
source "$TUTORIAL_DIR/mlinpl2026-half-life-skills/tutorial-env.sh"
```

**3. Check it.** It should print a version starting with `opencode v2.`:

```bash
opencode --version
```

> Want to keep opencode after the tutorial? Add `export PATH="$HOME/.opencode/bin:$PATH"` to your `~/.bashrc` (or `~/.zshrc`) yourself, or reinstall without `--no-modify-path`.

## 2. Install the PLGrid provider

opencode doesn't know about PLGrid Forge out of the box. A small plugin adds it, with all its models. The plugin and a minimal config are in this repository, in [`opencode/`](../opencode/); they come from [groundnuty/plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode).

We install them **for your user**, in `~/.config/opencode/`, so they apply in every directory, including the workspace the geant4-ai toolkit creates later.

**1. Create opencode's config directory:**

```bash
mkdir -p ~/.config/opencode/plugins
```

**2. Copy the plugin:**

```bash
cp "$TUTORIAL_DIR/mlinpl2026-half-life-skills/opencode/plugins/plgrid.js" ~/.config/opencode/plugins/
```

**3. Copy the config.** It sets the default model. If you already use opencode and have a `~/.config/opencode/opencode.json`, don't overwrite it: add the `model` and `small_model` lines from our file to yours instead.

```bash
cp "$TUTORIAL_DIR/mlinpl2026-half-life-skills/opencode/opencode.json" ~/.config/opencode/opencode.json
```

## 3. Log in with your API key

<!-- TODO: how participants get their LLM Lab API key (tutorial grant? keys handed out with the Ares logins?). -->

**TODO:** how to get your API key for the tutorial.

**1. Log in.** opencode asks for the key; paste it and press Enter. It's stored in `~/.local/share/opencode/opencode.db`, never in this repository:

```bash
opencode auth login plgrid
```

**2. Check that the models are there.** This should list about 20 models, each starting with `plgrid/`. The PLGrid models only appear after you've logged in. If it prints nothing, run it once more:

```bash
opencode models | grep '^plgrid/'
```

**3. Ask the model something.** This sends one prompt and prints the answer, without starting the TUI:

```bash
opencode run "Reply with one word: ready"
```

If it answers, opencode is ready. If you get *"not available for grant"*, your key can't use that model; see [Which model](#which-model).

## 4. Try the TUI

Start it in any directory:

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

## Which model

The default is `deepseek-ai/DeepSeek-V4.1-Flash`: the fastest of the reliable models. Others, all switchable with `/models`:

| Model | Notes |
|---|---|
| `deepseek-ai/DeepSeek-V4.1-Flash` | Default. Fast and reliable with tools, but only some grants can use it |
| `Qwen/Qwen3.6-27B` | Every grant can use it. Reliable with tools, a bit slower |
| `google/gemma-4-31B` | Every grant can use it; used for short background tasks such as session titles |

If DeepSeek answers *"not available for grant"*, make Qwen your default: in `~/.config/opencode/opencode.json`, change the `model` line to `"model": "plgrid/Qwen/Qwen3.6-27B"`.

Several other models in the list can't use tools at all, so they can't run commands or edit files. Measured comparisons of all of them are in [plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode/blob/main/research/models.md).

---

[← First simulation](05-first-simulation.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](07-agent-setup.md)
