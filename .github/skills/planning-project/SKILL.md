---
name: planning-project
description: Composite Skill. This skill is used for project planning. Users request that a project plan be created, particularly during the initial stages.
---

# planning-project

## Related Skills

- preparation-planning-doc
- context7-mcp
- coding-standard
- app-testing

## Task order

1. Search draft in root.
   - If not found, you should lead user to decide the project, by asking questions about the project, such as "What is the project about?", "What is the goal of the project?", "Who is the target audience?", etc.
   - If found, you should ask user to confirm the draft, and then you can use the information in the draft to plan the project.
2. Use skill `preparation-planning-doc` to create a project plan document.
   - While createing document, you should use skill `context7-mcp` to get the latest information about framework, library, and tools related to the project. Because you and the user have the limit knowledge.
   - Also, `coding-standard` skill and `app-testing` skill are useful for planning the project, so you should use them when needed.
3. After creating the project plan document, you should ask user to confirm the document.
4. Finally, you should summarize the project plan and give it to the user.
