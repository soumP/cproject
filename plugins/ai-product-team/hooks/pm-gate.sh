#!/usr/bin/env bash
# PM gate: anything that leaves the machine needs the PM's yes.
# Force pushes are blocked outright. Pushes, publishes and deploys always prompt.
input="$(cat)"

decide() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}\n' "$1" "$2"
  exit 0
}

if printf '%s' "$input" | grep -Eq 'git push[^"]*(--force|[[:space:]]-f([[:space:]]|\\|")|--force-with-lease)'; then
  decide deny "AI product team: force pushes are never allowed."
fi

if printf '%s' "$input" | grep -Eq '(git push|npm publish|pnpm publish|yarn publish|vercel|netlify deploy|fly deploy|gh release create|gh pr merge)'; then
  decide ask "AI product team: this goes outside the repo. PM, is this your yes to ship?"
fi

exit 0
