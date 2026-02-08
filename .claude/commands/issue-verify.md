## /issue-verify

### description

Verification and intent-based review orchestration.

### Session Rule

- Start stateless
- Use ONLY artifacts:
  - .claude/artifacts/issue-{id}/research.md
  - .claude/artifacts/issue-{id}/plan.md
  - .claude/artifacts/issue-{id}/implement-log.md
- If any missing -> STOP and request required phase.

---

## Review Intent Model

This command works with REVIEW INTENTS only.
Do NOT assume concrete subagent names.

Supported intents:

- safety
- design
- implementation
- accessibility

Agent resolution is an external responsibility.

---

## Intent Inference Rules (rule-based)

Infer intents from artifacts:

### safety

IF changes include:

- authentication / authorization
- input validation
- permissions
- personal data handling
- external I/O

### design

IF changes include:

- layer boundary modification
- domain model change
- public API change
- cross-module dependency

### implementation

IF changes include:

- business logic
- refactoring
- performance
- error handling

### accessibility

IF changes include:

- UI markup
- semantics
- interaction
- visual components

Multiple intents are allowed.

If inference result is empty or ambiguous:
ASK USER:

"Select review intents (multiple allowed):

- safety
- design
- implementation
- accessibility"

---

## Review Execution (serial)

For each inferred intent in order:

1. Resolve concrete agent externally.
2. Call Task tool:

subagent_type = <resolved agent>

Instructions to subagent:

- inspect modified files
- evaluate according to intent
- report issues by severity
- suggest minimal fixes

3. Collect result before next intent.

---

## Verification

1. Describe manual verification steps.
2. Describe automated test confirmation.

---

## Output

Write to:
.claude/artifacts/issue-{id}/verify.md

Structure:

# Verify Artifact

## Intents Used

## Verification Procedure

## Review Results

### [intent]

- findings
- applied fixes

## Remaining Limitations