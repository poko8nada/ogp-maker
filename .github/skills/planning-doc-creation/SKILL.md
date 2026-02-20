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
- Tasks should be appropriately divided based on implementation order, not functional order.
- Implementation order should be the top priority.
- Limit the creation of files to a maximum of 5 per task.
- Completion criteria for each task must be defined **concretely and explicitly**, such as successful testing, visual verification in the development environment, and api response confirmation, etc.
- Flag risky items (DB schema, dependencies, CI/CD, etc.)
