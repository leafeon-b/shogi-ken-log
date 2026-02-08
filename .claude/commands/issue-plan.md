## /issue-plan

### description

Create plan from research artifact.

### Session Rule

- Ignore all previous context
- Use ONLY:
  .claude/artifacts/issue-{id}/research.md
- If not exists -> STOP and ask to run /issue-research

### instructions

1. Load research.md
2. Analyze impact
3. Create small tasks

Output to:
.claude/artifacts/issue-{id}/plan.md

# Plan Artifact

## Impacted Layers

- presentation
- usecase
- domain
- infrastructure

## File Changes

## Risks

## Tasks

1.
2.
