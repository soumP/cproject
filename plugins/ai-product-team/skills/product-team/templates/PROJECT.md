# Project facts

Every agent reads this file before working. The Lead fills it in during `/team-init`; the PM can
edit it any time.

- **What this is:** <one line>
- **Stack:** <languages, frameworks>
- **Where the code lives:** <main source folders>
- **Who it's for:** <target users / customers>
- **How it makes money (or plans to):** <free, ads, subscription, one-off…>
- **Known competitors:** <names, if any>
- **Conventions:** <link to README or style notes>

## Commands
- **Install:** `<e.g. npm install>`
- **Checks (must pass before review and before ship):** `<e.g. npm run typecheck && npm test>`
- **Build:** `<e.g. npm run build>`

## Dev environment (where QA tests)
- **Start:** `<e.g. npm run build && npm run start -- -p 3001>` (run in the background)
- **Stop:** `<e.g. pkill -f "next start -p 3001">`
- **URL / how to reach it:** `<e.g. http://localhost:3001>`
- **How QA tests it:** `<e.g. Playwright against the URL / run the CLI / call the API>`

## Shipping
- **Ship = :** `<e.g. commit and push to branch X / open a PR to main>`
- **Never ship to:** `<protected branches or environments>`
