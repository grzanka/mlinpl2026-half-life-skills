# opencode setup for PLGrid Forge (Cyfronet LLM Lab)

Files used by [Setting up opencode](../docs/06-opencode-setup.md):

| File | What it is |
|---|---|
| [`plugins/plgrid.js`](plugins/plgrid.js) | opencode provider plugin for the PLGrid Forge models at `llmlab.plgrid.pl`. Works with opencode 1.x and 2.x (the tutorial uses 2.x). Copied unchanged. |
| [`opencode.json`](opencode.json) | Minimal global config: picks the default model and turns off session sharing. |

The plugin comes from [groundnuty/plgrid-llmlab-opencode](https://github.com/groundnuty/plgrid-llmlab-opencode) (commit `a844c0f`, licence: "do what you like with it"). That repository also has a fuller `opencode.json` with extra agents, commands and an MCP server, plus measurements of every model; see it if you want more than this tutorial needs.

We don't use its full `opencode.json` here: the geant4-ai toolkit brings its own agents, commands and permissions, and the extra MCP server needs Node.js, which you may not have (on Ares, for example).

The default model, `deepseek-ai/DeepSeek-V4.1-Flash`, is the fastest reliable one, but only some PLGrid grants can use it. If yours can't, switch to `Qwen/Qwen3.6-27B`, which every grant can use.
