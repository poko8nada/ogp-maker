# Copilot Instructions

## Language and Communication Policy

- Always think, reason, and write code in English
- Always respond to user instructions and questions in **Japanese**
- Use concise, telegraphic style - minimize volume
- Avoid unnecessary explanations and emojis

## Documentation

- `docs/requirement-*.md` for requirements, specifications, and constraints
- `docs/task-*.md` for task breakdowns and progress

## Reference Skills

### Available Skills

- Skills are useful for specific contexts.
- `.github/skills/*/SKILL.md` files define each skill.

| Skill                 | When Used                                                           |
| --------------------- | ------------------------------------------------------------------- |
| `agent-memory`        | Save and recall reusable project knowledge                          |
| `app-testing`         | Minimal unit test coverage for business logic and API interactions  |
| `coding-standards`    | Code implementation, refactoring, testing                           |
| `context7-mcp`        | Access up-to-date, version-specific official documentation and code |
| `honox-architecture`  | HonoX development, routing, Islands, component patterns             |
| `nextjs-architecture` | Next.js App Router projects                                         |
| `planning`            | Planning phase, requirement gathering, task breakdown               |
| `ui-design`           | UI/UX design, styling, accessibility                                |

### Proactive Use of Skills

Knowledge-intensive tasks → Thoroughly review `SKILL.md` before starting work and precisely apply the documented procedures/constraints.

Before execution, clearly state in one line the reason for using the skill.

## Task Execution Workflow

**For every request**: Silently evaluate which skill(s) would help most. Load matching SKILL.md file(s) into context if relevant.

1. List tasks, files and what to do specifically → **Get approval**
2. Execute implementation
   - If bugs occur, loop this until resolved:
     Confirm bug details and gather info → Present bug description and propose fixes to user → **Get approval** → Execute countermeasure → Verify resolution and explain to user → **Seek further instructions from user** → Return to confirm bug

3. Run tests
   - If fails, loop this until fixed:
     Investigate and propose fixes → **Get approval** → Implement fixes → Rerun tests → Verify and explain → **Seek further instructions from user** → Return to investigate

4. Update documentation if needed
5. Type-check, lint and format code if needed
6. Prepare commit message → **Get approval** → Commit

## Trigger Keywords

When user input contains these keywords → **STOP & REQUEST APPROVAL**

- commit, push, git add
- create, modify, delete, fix, refactor
- build, deploy

## Tools

Use **pnpm** for all package management

## Git Workflow

### Commit Format

`<type>: <description>`

**Types:** add, fix, remove, update, WIP

### Rules

- English, imperative mood (Add, Update, Fix)
- Lowercase description, no period
- Be specific and concise
