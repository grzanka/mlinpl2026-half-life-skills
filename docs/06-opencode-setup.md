# Installing opencode

[← First simulation](05-first-simulation.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](07-agent-setup.md)

[opencode](https://opencode.ai) is the coding agent we use this afternoon. It runs in the terminal (a TUI, text user interface), so it works the same on Ares over SSH and on your laptop. On the next page we connect it to the open-weight models that ACK Cyfronet hosts for PLGrid (PLGrid Forge, at [llmlab.plgrid.pl](https://llmlab.plgrid.pl)), so your prompts and code stay on Polish academic infrastructure.

Install it both on Ares and on a laptop. On Ares, do it on your compute node: not sure you're on one? See [Before you start](04-test-geant4.md#0-before-you-start).

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

- **It needs its own login.** If you used 1.x before, 2.x copies your PLGrid key the first time it runs. Otherwise, log in as in [Setting up the agent](07-agent-setup.md#4-connect-opencode-to-the-plgrid-models); until then the PLGrid models don't appear.
- **It runs no language servers (LSP)**, so it doesn't get type-checker feedback after each edit the way 1.x can. That doesn't matter for this tutorial.
- **Our `opencode.json` settings are in the 1.x format**, which 2.x converts when it starts. If you edit it, keep that format: 1.x won't start with a config written in the 2.x format.

## 1. Install opencode

**1. Run the official installer.** It puts `opencode` into `~/.opencode/bin` and adds that directory to your `PATH` in `~/.bashrc` (or `~/.zshrc`); no admin rights needed:

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

> On macOS, `brew install opencode` works too. Don't use `npm install -g opencode-ai` or `https://opencode.ai/install` without `/v2`: those install 1.x.

**2. Put opencode on your `PATH` in this terminal.** The installer's change to `~/.bashrc` only applies to new terminals. [`tutorial-env.sh`](../tutorial-env.sh) adds `~/.opencode/bin` whenever it exists, so rerun it now:

```bash
source "$TUTORIAL_DIR/mlinpl2026-half-life-skills/tutorial-env.sh"
```

**3. Check it.** It should print a version starting with `opencode v2.`:

```bash
opencode --version
```

## Next: connect it to the PLGrid models

opencode doesn't know the PLGrid models yet. We connect it to them in the directory where you'll use it, the geant4-ai workspace, which you create on the next page: [Setting up the agent](07-agent-setup.md).

---

[← First simulation](05-first-simulation.md) · [Agenda](00-agenda.md) · [Next: set up the agent →](07-agent-setup.md)
