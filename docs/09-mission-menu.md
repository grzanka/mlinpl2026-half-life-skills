# Mission menu (16:00–17:15)

[← Worked example: shielding](08-shielding-demo.md) · [Agenda](00-agenda.md)

Pick **one** mission and work on it with your agent. Each has its own page with everything you need to copy and paste.

| Mission | The question | Run time | Page |
|---|---|---|---|
| 🏠 Fallout shelter | How thick must a concrete or lead wall be to cut the gamma dose from fallout by 10× and by 1000×? | Minutes | [Mission: fallout shelter](10-mission-fallout-shelter.md) |
| ⛄ Snowman → water | How much of a particle beam's energy stays in a snowman, and how long until it melts 1 litre of water? | Seconds to minutes | [Mission: snowman](11-mission-snowman.md) |
| 🪳 Cockroach at the LHC | What dose does a cockroach get next to a 6.8 TeV proton beam loss, and how many lost protons kill it? | Long: a cluster job | [Mission: cockroach](12-mission-cockroach.md) |

Not sure? The snowman runs fastest, the shelter is the most practical, and the cockroach is the heaviest job and the best excuse to use the cluster.

## Two ways to start

Every mission page gives you two prompts for `/g4-new`. Pick one:

- **Guided prompt.** Short: it states the question and asks the agent to **propose** the geometry, source, scoring and statistics, and to wait for your approval. You decide what to keep. This is where you see what the agent assumes on its own, and where most of the interesting mistakes show up.
- **Full prompt.** Every number is pinned down: geometry, materials, beam, scoring, events, outputs. The agent has little to decide, so you get a result faster, and you can compare it directly with the reference values on the mission page.

A good plan: start with the guided prompt, compare the agent's proposal with the full prompt, and point out the differences to the agent before you approve.

## How to work through a mission

1. **Predict first.** Write down your guess before running anything. Each mission page has a question to guess at.
2. **Start the agent in your workspace.** On Ares, on your compute node ([Before you start](04-test-geant4.md#0-before-you-start)):

   ```bash
   cd "$TUTORIAL_DIR/g4work"
   ```

   ```bash
   opencode --auto --continue
   ```

   `--auto` saves you from approving every command ([what it does](07-agent-setup.md#fewer-prompts---auto)); leave out `--continue` to start a fresh session.
3. **Paste the prompt** and approve stage by stage. At the geometry stage, look at it in the [GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/) ([how](08-shielding-demo.md#look-at-the-geometry)).
4. **Check against the reference values** on the mission page. Don't show them to the agent before it has its own answer.
5. **Hunt for a failure mode.** Each page lists the mistakes to look for. Find one the agent made (or nearly made), and note how you caught it.
6. **Ground the agent on real sources.** Ask it where a number comes from: the Geant4 source, NIST tables, the toolkit's knowledge base. "I remember that" is not a source.

Bring your "the agent got this wrong, and here's how we caught it" story to the [Q&A](00-agenda.md) at 17:40.

## Useful while you work

| You want to | Do this |
|---|---|
| See the geometry | `cat runs/<id>/geometry.gdml`, paste into the [GDML Viewer](https://grzanka.github.io/mlinpl2026-half-life-skills/) |
| See a plot made on Ares | Copy it to your laptop with `scp` ([how](05-first-simulation.md#on-ares-copy-the-plot-to-your-computer)) |
| Get back to your session | `opencode --auto --continue`, or `/resume` inside opencode ([sessions](07-agent-setup.md#coming-back-to-a-session-resume)) |
| Rerun without the agent | `cd runs/<id>` and `./run.sh` (`./run.sh smoke` for a quick low-statistics run) |
| Run something long on Ares | Ask the agent for a Slurm batch job on the `cpu` partition, for example "submit this as a batch job with 12 cores for 1 hour on partition cpu" |

---

[← Worked example: shielding](08-shielding-demo.md) · [Agenda](00-agenda.md)
