---
name: planning-doc-creation
description: Core Skill. This skill is for document creation. User ask you to create planning documents, such as requirement and task breakdown.
---

# Preparation and Creation of Planning Documents

## Incremental Development

follow this sequence:

1. **MVP** (Minimum Viable Product) - Core functionality only
2. **Product or Prod v1** - Essential features
3. **Product or Prod v2+** - Enhancements and optimizations

## Documentation Structure

Read and use templates in `/docs/template/`:

```
docs/
├── template/
│   ├── requirements-mvp.template.md
│   └── tasks-mvp.template.md
├── requirements-mvp.md
├── requirements-v1.md (or requirements-prod1.md)
├── requirements-v2.md (or requirements-prod2.md)
├── tasks-mvp.md
├── tasks-v1.md (or tasks-prod1.md)
└── tasks-v2.md (or tasks-prod2.md)
```

## Documentation Creation

**NOTE**: Following the documentation is fundamental to advancing the project, but since changes inevitably arise as the project progresses, the documentation should be **flexible** and designed to withstand modifications.

Regarding template items:

- Do **NOT** make assumptions or delete items without permission.
- If anything is unclear, always **ASK** the user and have discussion.

### Basic Technology Stack

- **Language**: TypeScript
- **Testing**: Vitest
- **Package Manager**: pnpm

### Requirement Gathering and MVP Definition

- Use `/docs/template/requirements-*.template.md`
- Define requirements while discussing user stories and acceptance criteria.
- Functions, Components, Tests, Types, and APIs should be explicitly defined in the requirement document.
- Keep in mind what each version should achieve starting from MVP to v1, v2, etc.
- However no need to force a division. Depending on functionality and implementation costs, it's acceptable to define everything as part of the MVP or v1.

### Task Breakdown

- Use `/docs/template/tasks-*.template.md`
- Limit the creation of files to a maximum of 5 per task.
- Flag risky items (DB schema, dependencies, CI/CD, etc.)

#### Vertical Slice Principle

Tasks must follow a **vertical slice** approach: each task produces something that actually runs and can be verified in the development environment. Do NOT stack up files and functions task by task and only verify at the end.

Structure tasks like this:

1. **Skeleton first** — The first task always builds the thinnest possible working slice. For example, an endpoint that returns a hardcoded response. Verify it runs with `pnpm run dev` before moving on.
2. **Flesh it out** — Subsequent tasks add real behavior on top of the working skeleton (validation, business logic, external integrations, etc.), one layer at a time.
3. **Stabilize** — Later tasks add caching, error handling, and edge case coverage once the happy path is solid.

#### Completion Criteria Rules

Completion criteria for each task must be **concrete and verifiable**, combining both of the following:

- **Runtime verification**: what you can actually confirm in `pnpm run dev`
  - e.g. `GET /ogp?slug=hello` returns `200` with `Content-Type: image/png`, the response image visually contains the blog icon
  - e.g. access to `/` and see the expected UI rendered, or a function returns the expected output when called
- **Automated verification**: which tests pass (e.g. `validate.test.ts` normal/error cases all pass)

Criteria like "implementation complete" or "tests pass" alone are **not acceptable**. Every task must include at least one runtime check.

#### Tests Are Written In The Same Task

Tests for a feature must be written in the same task as the feature itself, not deferred to a later task. If a task adds a function, its unit tests are part of that task's completion criteria.
