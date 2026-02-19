---
name: planning-project
description: Composite Skill. This skill is used for project planning. Users request that a project plan be created, particularly during the initial stages.
---

# Planning Project Instructions

## Related Skills

You can use the following skills to help you with project planning.

- planning-doc-creation
- context7-mcp
- coding-standard
- app-testing

Also, consider other skills that might be useful.

- frontend-design
- \*-architecture, etc.

## Task order

1. Search draft in root.
   - If not found, ask the user questions about the project. And discuss with the user to decide the project’s scope, goals, and requirements.
     - “What is the project about?”
     - “What is the project's purpose?”
     - “Who is the target audience?”
   - If found, ask the user to review the draft and plan the project based on the draft's information.
2. Use skill `planning-doc-creation` to create a project plan document.
   - While createing document, you should use skill `context7-mcp` to get the latest information about framework, library, and tools related to the project. Because both you and the user may possess outdated knowledge as a hallucination.
   - Also `coding-standards` and `app-testing` skills are useful for understanding the project's fundamental rules, so utilize them as needed.
3. After creating the project plan document, you should ask user to confirm the document.
4. Finally, you should summarize the project plan and give it to the user.
