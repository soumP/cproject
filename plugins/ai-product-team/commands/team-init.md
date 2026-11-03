---
description: Set up the AI product team in this repo (creates team/ with board, decisions, briefs and project facts)
---

Load the `product-team` skill. Then set up this repo:

1. If `team/BOARD.md` already exists, say so and stop.
2. Copy the skill's `templates/` into `./team/` (`PROJECT.md`, `BOARD.md`, `DECISIONS.md`,
   `briefs/_TEMPLATE.md`) and create `team/designs/`.
3. Fill in `team/PROJECT.md` by inspecting the repo (README, package/build files, CI config). For
   anything you can't work out (especially **Shipping**), ask the PM. Don't guess.
4. Show the PM the filled-in PROJECT.md and tell them: `/team <request>` starts a task, and
   `/board` shows status.
