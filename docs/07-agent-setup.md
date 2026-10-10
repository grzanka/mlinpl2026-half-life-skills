# Setting up the agent: the geant4-ai toolkit (14:45)

[← Installing opencode](06-opencode-setup.md) · [Agenda](00-agenda.md) · [Next: worked example →](08-shielding-demo.md)

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

**2. Show your API key.** Each tutorial account has its own key, in a file in your Ares home directory named after your login. The file has no line break at the end, so `echo` adds one; otherwise the key runs straight into your next prompt:

```bash
cat "$HOME/token-mlinpl2026-opencode-$USER.txt"; echo
```

It prints one line starting with `plg-`. Select and copy it. Treat it like a password: don't paste it anywhere except the next step.

> **On a laptop**, read the key from Ares. Run this on your laptop, with your tutorial login in place of `tutorial512`:
>
> ```bash
> ssh tutorial512@ares.cyfronet.pl 'cat token-mlinpl2026-opencode-tutorial512.txt; echo'
> ```

**3. Log in.** Run this inside the workspace (you're there since you [created it](#3-create-your-workspace)), because that's where opencode now knows PLGrid. opencode asks for the key; paste it and press Enter. It's stored in `~/.local/share/opencode/opencode.db`, never in this repository:

```bash
opencode auth login plgrid
```

**4. Check that the models are there.** This should list about 20 models, each starting with `plgrid/`. If it prints nothing, run it once more:

```bash
opencode models | grep '^plgrid/'
```

**5. Ask the model something.** This sends one prompt and prints the answer, without starting the full interface:

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
| **Shift+Tab** | Switch agent (`build` can edit files and run commands, `plan` only reads) |
| `/exit` or **Ctrl+C** | Quit |

opencode asks before it runs a command or edits a file. You'll see these prompts a lot:

```text
△ Permission required
$ cd …/g4work && bash scripts/check_geant4.sh 2>&1 | head -50
  Allow once    Always allow    Reject
```

| Choice | When to use it |
|---|---|
| **Allow once** | The default. You've read the command and it does what you asked |
| **Always allow** | Commands that only read and that you'll see again and again, such as `ls`, `cat` or the toolkit's check scripts. opencode stops asking about that command |
| **Reject** | Anything you don't understand, or that touches files outside the workspace. Then tell the agent why |

Read what it wants to do before you approve it: that's the habit this whole afternoon is about.

### Copying text out of opencode

You'll want to copy things out of opencode: a command, a number, a file to paste into the [GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/). It doesn't work the way you might expect.

**In a Linux terminal, copy is Ctrl+Shift+C and paste is Ctrl+Shift+V.** Ctrl+C doesn't copy: it interrupts the running program, and in opencode it quits.

**In opencode, select text with the mouse and it's copied straight away.** opencode shows *Copied to clipboard*. Paste with Ctrl+V in a browser or another program, Ctrl+Shift+V in a terminal. Middle-click doesn't paste it.

**Why opencode copies by itself.** Normally the terminal window does the selecting and copying, and the program running inside it never knows. opencode, like most full-screen terminal apps, asks the terminal to pass mouse clicks and scrolling to it instead. So when you drag the mouse, the terminal doesn't select anything. opencode draws the selection itself, and then it has to put the text on your desktop's clipboard on its own.

**Why that needs an extra package on Linux.** A program running in a terminal can only read keys and write text to the screen. It can't reach the desktop's clipboard. To get there, opencode runs a small helper program:

| Your desktop session | Helper | Package |
|---|---|---|
| Wayland (Ubuntu's default since 22.04, Fedora's default) | `wl-copy` | `wl-clipboard` |
| X11 | `xclip` or `xsel` | `xclip` |
| macOS | `pbcopy` | built in |

Without a helper, opencode falls back to a special terminal code (OSC 52) asking the terminal to put the text on the clipboard. Some terminals do that, including kitty, WezTerm, Alacritty and foot. The GNOME terminals Ubuntu ships, GNOME Terminal and Ptyxis, ignore it. opencode still says *Copied to clipboard*, but nothing reaches the clipboard, and Ctrl+V pastes nothing or whatever you copied earlier.

**The fix, on a Linux laptop.** Install both helpers, so it works on Wayland and X11 alike, then quit and restart opencode:

```bash
sudo apt-get install -y wl-clipboard xclip
```

(Fedora: `sudo dnf install -y wl-clipboard xclip`.) To see which session you're on, run `echo $XDG_SESSION_TYPE`.

**On Ares, over SSH, the helper doesn't help.** opencode runs on Ares, which has no desktop and no clipboard of yours. It can only send the OSC 52 code to your terminal, so copying works if your terminal supports OSC 52 and silently fails if it doesn't.

**On Ares, copy with Shift.** This works in any terminal, including Ubuntu's, and needs nothing installed:

1. **Hold Shift** and keep holding it.
2. **Drag the mouse** over the text you want. While Shift is held, the terminal doesn't pass the mouse to opencode; it selects the text itself, the way it does in a plain shell. opencode doesn't show *Copied to clipboard*: that's expected.
3. **Press Ctrl+Shift+C** to copy the selection to your laptop's clipboard. You can let go of Shift between steps 2 and 3; the selection stays.
4. **Paste** with Ctrl+V in a browser, or Ctrl+Shift+V in a terminal.

The terminal copies exactly what it shows, so keep the selection inside opencode's message area. Two limits:

- **Only what's on screen.** The terminal can't scroll opencode's history while you select, so text longer than one screen has to be copied in pieces.
- **Screen layout comes along.** Lines that opencode wrapped arrive as separate lines, and a selection that runs across the side panel picks it up too.

For a long file, copy the file, not the text (below).

**Or use a terminal that supports OSC 52.** Then plain selection in opencode works over SSH too, the same way as on a laptop. Kitty, WezTerm, Alacritty and foot all support it; kitty, Alacritty and foot come from Ubuntu's package archive, for example `sudo apt-get install -y kitty`. Some may need OSC 52 switched on in their settings; check that terminal's documentation. For the tutorial, Shift+drag in the terminal you already have is less to set up.

**For whole files, copy the file, not the text.** Long files such as `geometry.gdml` don't fit on one screen. Copy the file to your laptop with `scp` ([how](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)), then load it in the GDML Viewer with **Open file…** or by dropping it onto the page. You can also `cat` it in a second terminal, outside opencode, and copy from there with Ctrl+Shift+C.

### Fewer prompts: `--auto`

Approving every `ls` gets tedious. Start opencode with `--auto` and it approves permission requests by itself:

```bash
opencode --auto
```

What `--auto` does and doesn't do:

- **It approves everything that isn't explicitly denied:** commands, file edits, web fetches. You no longer see the commands before they run, so watch the output as it scrolls by.
- **A few commands stay forbidden.** `add-plgrid.sh` put these deny rules into the workspace's `opencode.json`, and `--auto` never overrides a deny: `rm -rf`, `rm -fr`, `sudo`, `git push` and `git reset --hard`. The agent gets a refusal and has to find another way.
- **It doesn't skip the toolkit's stages.** `/g4-new` still stops after each stage and waits for you to say "go on": those are questions in the conversation, not permission prompts.

A good rhythm: do the [warm-up](#6-warm-up-ask-the-toolkit-a-question) without `--auto`, so you see what kind of commands the agent runs, then switch it on.

### Coming back to a session: `/resume`

Everything you do in opencode is a **session**: your messages, the agent's answers and its commands. Sessions are saved, so quitting opencode loses nothing.

- **Inside opencode**, type `/resume` (or `/sessions`) to see your earlier sessions in this workspace, and pick one to carry on with.
- **From the shell**, `--continue` (`-c`) reopens the last session directly. To switch on `--auto` for a session you started without it, quit and reopen it like this:

```bash
opencode --auto --continue
```

That's also how you get back after losing the connection to Ares: log in, get a compute node, `cd "$TUTORIAL_DIR/g4work"`, and continue where you left off.

As a first test, ask:

> What version of Geant4 is installed here? Check it with a command; don't guess.

The agent should run `geant4-config --version` instead of answering from memory. That's the habit we'll build on all afternoon.

## 6. Warm-up: ask the toolkit a question

Before running a whole simulation, ask the toolkit something with `/g4`, the command for a single question or task. It routes your question to the right specialist and checks the answer against the toolkit's knowledge base and your Geant4 installation:

```text
/g4 Can we simulate beer in Geant4? Which materials would we need, and are they in Geant4's NIST material database?
```

Watch how it works rather than just the answer: which commands it wants to run (approve them one by one), which files it reads, and whether it checks things or guesses. A good answer finds water, ethanol (`G4_ETHYL_ALCOHOL`) and carbon dioxide (`G4_CARBON_DIOXIDE`) in the database, and explains that beer itself isn't there but can be defined as a mixture by mass fractions.

> The first time the agent runs a toolkit helper script, uv sets up the workspace's Python environment (`.venv`) and downloads about 200 MB of packages. That takes a minute; later runs reuse it.
>
> To list materials, particles, physics lists or scoring quantities directly, use `/g4-list` with a category and an optional filter, for example `/g4-list materials ethyl`. It doesn't take free-form questions; those go to `/g4`.

## 7. Next: a simulation, step by step

Your agent is ready. We build the first simulation together: [Worked example: does more shielding mean less dose?](08-shielding-demo.md)

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

[← Installing opencode](06-opencode-setup.md) · [Agenda](00-agenda.md) · [Next: worked example →](08-shielding-demo.md)
