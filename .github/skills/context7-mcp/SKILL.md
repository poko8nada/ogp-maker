---
name: context7-mcp
description: Core Skill. Access up-to-date, version-specific official documentation and code examples for libraries, frameworks, and tools via the Context7 MCP server.
---

# Context7 MCP Skill

## Description & purpose

This skill prevents hallucinations, outdated APIs, or deprecated patterns by injecting real, current docs directly into reasoning and code generation.  
Be aware that your knowledge has a **cutoff** point, and recognize the importance of the latest information.

## When to Use This Skill

- Any coding question involving a specific library/framework (React, Next.js, Prisma, Supabase, FastAPI, etc.).
- Need current best practices, API reference, or examples for a particular version.
- User mentions phrases like: "latest docs", "current API", "up-to-date", "check the docs", or the skill trigger.
- Avoid generic/outdated knowledge; always prefer fresh documentation.

## Core Capabilities

This skill exposes two main underlying MCP functions (the agent/tool automatically handles them):

1. **Library Resolution**
   - Input: natural language package/framework name (e.g. "Next.js", "react-router", "supabase auth")
   - Output: matching Context7 library ID(s), usually in format like `/nextjs/nextjs` or `/supabase/supabase`
   - Automatically called when needed; you rarely invoke it directly.

2. **Documentation & Example Retrieval**
   - Input: library ID + optional query/topic/version (e.g. "routing in app router", "useSession hook", "v15.0.0")
   - Output: relevant sections of the latest official docs + code examples, filtered and ranked for relevance.
   - Supports version pinning, topic filtering, and multiple languages where available.

## Best Practices for Using the Skill

- Be specific in the query part after the trigger → better relevance & smaller context usage.  
  Good: "How to use the new `unstable_cache` in Next.js? use context7"  
  Bad: "Next.js stuff use context7" (too vague → more noise)

- For version-specific needs, mention the version explicitly:  
  "useContext hook changes in React 19? use context7"

- Chain with other tools if needed (e.g. resolve library → get docs → then code gen).

- If the library isn't found, fall back to web search or say "Library not indexed in Context7 yet."

## Limitations

- Only covers libraries/frameworks indexed by Context7 (thousands available: React, Next.js, Node, Python libs, Prisma, Tailwind, etc.).
- Private/internal docs not supported (public docs only).
- Token usage depends on how much doc content is pulled — use narrow queries for efficiency.
- Requires MCP client support (Cursor, Claude Code, VS Code with extensions, Windsurf, etc.).

## Quick Examples

**Prompt:**
Write a middleware to verify JWT from cookies in Next.js App Router. use context7

**Expected behavior:**
Agent resolves "Next.js" → pulls latest middleware docs → generates accurate code using current patterns (e.g. `NextRequest`, `cookies()` helper).

**Prompt:**
Show usage of createClient in @supabase/supabase-js v2. use context7

**Expected behavior:**
Fetches v2 docs → returns correct import + initialization example.

Use this skill whenever accuracy and freshness matter more than speed.
