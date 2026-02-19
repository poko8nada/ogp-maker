---
name: general-task
description: Composite Skill. This skill is designed to handle general tasks that may arise during the development process. It encompasses a wide range of activities, including coding, design, testing, and project management.
---

# General Task Instructions

## Related Skills

You can use the following skills to help you with general tasks.

- coding-standards
- frontend-design
- app-testing

Also, consider other skills that might be useful.

- context7-mcp
- playwright-cli
- agent-memory, etc.

## Task order

1. Read `docs/requirements-*.md` and `docs/tasks-*.md` to understand the requirements and tasks.
2. Determine the most important task to work, and tell the user about it.
3. Ask the user that your roll is `main worker` or `support and advisor`.
   - If the user choose `main worker`, you should work on the task by yourself.
   - If the user choose `support and advisor`, help the user and tell task detail and reason clearly, evaluate options. **Every response must be complete in one exchange.**
4. If bugs or issues are found during the work, report first to the user.
   - Ask the user to switch to debug skill mode temporarily.
   - After resolving, return to the general task mode.
5. When finished working on the task, update and maintain `docs/tasks-*.md` to keep track of the progress and next steps. (This is always your responsibility.)
   - While doing the task, there may be cases where the plan should be changed. In such cases, you should consider to change `docs/*` to reflect the new plan.
6. Ask the user to review your work and give feedback.
7. Think commit message and tell the user. If approved, commit the code to the repository.
