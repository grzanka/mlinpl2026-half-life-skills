# opencode setup for PLGrid Forge (Cyfronet LLM Lab)

Files used by [Setting up the agent](../docs/07-agent-setup.md#4-connect-opencode-to-the-plgrid-models). They connect opencode in **one directory** (the geant4-ai workspace) to the PLGrid Forge models:

| File | What it is |
|---|---|
| [`plugins/plgrid.js`](plugins/plgrid.js) | opencode provider plugin for the PLGrid Forge models at `llmlab.plgrid.pl`. Works with opencode 1.x and 2.x (the tutorial uses 2.x). Copied unchanged. |
| [`opencode.json`](opencode.json) | Settings to merge into the directory's `opencode.json`: the default model, and session sharing turned off. |
| [`add-plgrid.sh`](add-plgrid.sh) | Installs both into a directory: `bash add-plgrid.sh <directory>`. Copies the plugin to `<directory>/.opencode/plugins/` and merges the settings into `<directory>/opencode.json`, keeping what's already there. |

The plugin comes from [groundnuty/plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode) (commit `a844c0f`, licence: "do what you like with it"). That repository also has a fuller `opencode.json` with extra agents, commands and an MCP server, plus measurements of every model; see it if you want more than this tutorial needs.

We don't use its full `opencode.json` here: the geant4-ai toolkit brings its own agents, commands and permissions, and the extra MCP server needs Node.js, which you may not have (on Ares, for example).

The default model, `deepseek-ai/DeepSeek-V4.1-Flash`, is the fastest reliable one, but only some PLGrid grants can use it. If yours can't, switch to `Qwen/Qwen3.6-27B`, which every grant can use.
