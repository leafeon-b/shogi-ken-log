## /issue-implement

### description

Implement based on plan artifact.

### Session Rule

- Stateless start
- Use ONLY:
  .claude/artifacts/issue-{id}/plan.md
- If not exists -> STOP

### instructions

For each task:

1. Implement minimal change
2. Record to implement-log.md

After each task ASK:

"Continue to next task? (y/n)"

Output to:
.claude/artifacts/issue-{id}/implement-log.md

## Rules

- no unrelated refactor
- no new library without justification
