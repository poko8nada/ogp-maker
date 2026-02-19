---
name: planning
description: Core Skill. Planning phase guidelines including requirement gathering, MVP definition, and task breakdown. Use when starting new features, creating specifications, or breaking down work.
---

# Planning Phase Instructions

## Development Methodology

### Incremental Development

Always follow this sequence:

1. **MVP** (Minimum Viable Product) - Core functionality only
2. **Product or Prod v1** - Essential features
3. **Product or Prod v2+** - Enhancements and optimizations

Never skip MVP phase. Build incrementally, validate early.

## Documentation Structure

Read and use templates in `docs/template/`:

```
docs/
├── template/
│   ├── requirement.template.md
│   └── tasks-mvp.template.md
├── requirement-mvp.md
├── requirement-v1.md (or requirement-prod1.md)
├── requirement-v2.md (or requirement-prod2.md)
├── tasks-mvp.md
├── tasks-v1.md (or tasks-prod1.md)
└── tasks-v2.md (or tasks-prod2.md)
```

## Document Creation

**NOTE**: Following the documentation is fundamental to advancing the project, but since changes inevitably arise as the project progresses, the documentation should be **flexible** and designed to withstand modifications.

Regarding template items:

- Do **NOT** make assumptions or delete items without permission.
- If anything is unclear, always **ASK** the user and have discussion.

### Basic Technology Stack

- **Language**: TypeScript (preferred) or JavaScript
- **Testing**: Vitest
- **Package Manager**: pnpm

### Requirement Gathering and MVP Definition

- Use `docs/template/requirement.template.md`
- Define requirements while discussing user stories and acceptance criteria
- Identify what's needed for the MVP, keeping v1 or v2 in mind
- **Get approval** before proceeding

### Task Breakdown

- Use `docs/template/tasks-mvp.template.md`
- Break features into <5 file changes per task
- Order tasks by dependency
- Flag risky items (DB schema, dependencies, CI/CD)
- **Get approval** before starting
