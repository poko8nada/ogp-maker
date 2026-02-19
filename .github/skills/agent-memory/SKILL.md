---
name: agent-memory
description: Core Skill. Save and recall reusable project knowledge across sessions. Result must be in Japanese.
---

# Agent Memory Skill

A lightweight persistent memory workflow for this repository.

## Location

- Memory root: `.github/skills/agent-memory/memories/`

## When to use

Use this skill when the user asks to:

- remember / save / note something
- recall past decisions or findings
- organize or clean previous notes

Also use proactively when you find knowledge worth preserving:

- non-obvious decisions and rationale
- tricky fixes and gotchas
- research findings that took effort
- resumable in-progress context

## Privacy rule for this project

- Treat `bio/` as sensitive.
- Save only the minimum necessary summary.
- Do not copy raw personal details unless explicitly requested.

## File format

Store each memory as Markdown with frontmatter:

```yaml
---
summary: "1-2 lines: what this memory contains and why it matters"
created: 2026-02-16
updated: 2026-02-16
status: in-progress # in-progress | pending | archived
tags: [strategy]
related: [source/trend/trend.md]
---
```

`summary` and `created` are required.

## Suggested structure

```text
memories/
├── project-context/
├── trend/
├── strategy/
└── content-ops/
```

Use kebab-case for folder/file names.

## Search workflow

```bash
# list summaries quickly
rg "^summary:" .github/skills/agent-memory/memories/ --no-ignore --hidden

# filter by keyword
rg "^summary:.*keyword" .github/skills/agent-memory/memories/ --no-ignore --hidden -i

# filter by tags
rg "^tags:.*keyword" .github/skills/agent-memory/memories/ --no-ignore --hidden -i
```

## Quality guidelines

- Write for future resumption (context, state, next step).
- Keep summaries decisive.
- Update stale notes or remove obsolete ones.
