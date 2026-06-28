# Update Knowledge for Session Handoff

Conversation is long, or the user is stepping away. Preserve what a new agent needs to continue.

## Step 1 — Assess what changed

Review the conversation. Identify:
1. Features added, advanced, or investigated
2. Existing docs that need updating
3. New domain terms learned
4. Non-obvious traps hit
5. General lessons across features
6. Unfinished work — goal + how far you got
7. Decisions deferred to the user

## Step 2 — Update the repo

Per `docs/conventions/conventions.md` maintenance section:

- **Feature completed:** update `CLAUDE.md` status. Ensure final state reflected. Run `/verify-feature`.
- **Feature partially advanced:** status to ⚠️ or 🚧. Note what's done + what's left in the feature's `notes.md` (no `TODO:` sections — fold into existing prose).
- **New domain terms:** add to `glossary.md`.
- **Non-obvious traps:** add to `gotchas.md`.
- **Existing doc learned something:** edit in place.
- **General lesson:** update relevant `docs/reference/` doc or `docs/` domain doc.
- **Convention change:** update convention first, then bring existing files into compliance.

## Step 3 — Update memory if needed

For things that persist across ALL future conversations (durable preferences, external system references). Do NOT save: temporary state, debugging details, anything already in repo docs.

## Step 4 — Confirm

In one short message: which docs updated, which status changes applied, one-line instruction for the next agent.

Do not write a session-continuation `.md` file. The repo already captures state.
