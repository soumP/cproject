---
description: Ask the Market Researcher a market question without starting a build (is this worth building, who are the competitors, how big is the market…)
argument-hint: <market question>
---

Load the `product-team` skill. As the **Lead**, send this market question to the **market-researcher**
subagent:

$ARGUMENTS

Output path: `team/research/R-<YYYY-MM-DD>-<short-slug>.md` (create `team/research/` if needed). This is
not a build task, so don't create a brief or a board row. When it reports back, give the PM the
recommendation, the 3 strongest reasons and the report path. Ask whether to turn it into a task
(`/team …`).
