# Setting up opencode with the PLGrid models

[← First simulation](05-first-simulation.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](07-agent-setup.md)

[opencode](https://opencode.ai) is the coding agent we use this afternoon. It runs in the terminal (a TUI, text user interface), so it works the same on your laptop and on Ares over SSH. We connect it to the open-weight models that ACK Cyfronet hosts for PLGrid (PLGrid Forge, at [llmlab.plgrid.pl](https://llmlab.plgrid.pl)), so your prompts and code stay on Polish academic infrastructure.

Do this both on a laptop and on Ares. On Ares, do it on your compute node ([Get a compute node](02-welcome-and-setup.md#get-a-compute-node-ares-only)).

> opencode also comes as a desktop app and a web interface. We use **only the terminal version**, release line **2.x**; the PLGrid setup below was built and tested for the terminal.

## 1. Install opencode

**1. Run the installer.** It puts `opencode` into `~/.opencode/bin` and adds that directory to your `PATH` in `~/.bashrc` (or `~/.zshrc`). No admin rights needed:

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

> On macOS, `brew install opencode` also gives you 2.x. Avoid `npm install -g opencode-ai` and the older `https://opencode.ai/install` script: they install 1.x, where the commands below differ.

**2. Load the new `PATH`** (`~/.zshrc` on macOS):

```bash
source ~/.bashrc
```

**3. Check it.** It should print a version starting with `opencode v2.`:

```bash
opencode --version
```

## 2. Install the PLGrid provider

opencode doesn't know about PLGrid Forge out of the box. A small plugin adds it, with all its models. The plugin and a minimal config are in this repository, in [`opencode/`](../opencode/); they come from [groundnuty/plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode).

We install them **for your user**, in `~/.config/opencode/`, so they apply in every directory, including the workspace the geant4-ai toolkit creates later.

**1. Create opencode's config directory:**

```bash
mkdir -p ~/.config/opencode/plugins
```

**2. Copy the plugin:**

```bash
cp "$HOME/mlinpl2026-half-life-skills/opencode/plugins/plgrid.js" ~/.config/opencode/plugins/
```

**3. Copy the config.** It sets the default model. If you already use opencode and have a `~/.config/opencode/opencode.json`, don't overwrite it: add the `model` and `small_model` lines from our file to yours instead.

```bash
cp "$HOME/mlinpl2026-half-life-skills/opencode/opencode.json" ~/.config/opencode/opencode.json
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
