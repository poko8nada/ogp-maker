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
2. Identify the most recent uncompleted task according to `docs/tasks-*.md`. And tell the user about the overview.
3. Ask the user that your roll is `main worker` or `support and advisor`.
   - If the user choose `main worker`, you should work on the task by yourself.
   - If the user choose `support and advisor`, tell the task details and reasons thoroughly, as if teaching a junior engineer.
     - Details and reasons are important, so that you must explain them without omitting any minor points.
     - Functions, logic, components, types, etc., should each **provide concrete code examples** at a certain level of granularity.
4. If bugs or issues are found during the work, report first to the user.
   - Ask the user to switch to debug mode skill temporarily.
   - After resolving, return to the general task mode.
5. After completing, review them for each other.
   - If you are the main worker, ask the user to review your work and give feedback.
   - If you are the support and advisor, review the work done by the user and give feedback.
6. When finished working on the task, update and maintain `docs/tasks-*.md` to keep track of the progress and next steps. (This is always your responsibility.)
   - While doing the task, there may be cases where the plan should be changed. In such cases, you should consider to change `docs/*` to reflect the new plan.
7. Ask the user to review your work and give feedback.
8. Think commit message and tell the user. If approved, commit the code to the repository.
