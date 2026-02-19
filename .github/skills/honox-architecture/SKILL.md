---
name: honox-architecture
description: Core Skill. HonoX architecture guidelines including file-based routing, Islands pattern, component types, performance optimization, and best practices for full-stack development.
---

# HonoX Architecture Guidelines

Use this skill as a **project-proven, reusable baseline** for HonoX applications.
It is derived from a working production setup and intentionally generalized for reuse.

## Version & Stack (Recommended Baseline)

- **Hono**: 4.x
- **HonoX**: 0.1.x
- **Runtime**: Cloudflare Workers (Wrangler)
- **Build**: Vite
- **CSS**: Tailwind CSS v4 (or project equivalent)
- **Storage**: Optional object storage (R2-compatible pattern)

## Project Structure (Reusable Shape)

```txt
app/
├─ client.ts
├─ server.ts
├─ global.d.ts
├─ style.css
├─ components/
├─ features/
│  └─ [domain-feature].tsx
├─ islands/
│  └─ [interactive-component].tsx
├─ lib/
│  ├─ [domain-parser].ts
│  └─ [storage-adapter].ts
├─ routes/
│  ├─ _renderer.tsx
│  ├─ _404.tsx
│  ├─ _error.tsx
│  ├─ index.tsx
│  ├─ [resource]/
│  │  ├─ index.tsx
│  │  └─ [param].tsx
│  └─ api/
│     └─ [resource]/
│        └─ [param].ts
└─ utils/
   └─ types.ts
```

## File-Based Routing (Pattern)

- `app/routes/index.tsx` → `/`
- `app/routes/[resource]/index.tsx` → `/[resource]`
- `app/routes/[resource]/[param].tsx` → `/[resource]/:param`
- `app/routes/api/[resource]/[param].ts` → `/api/[resource]/:param`
- `app/routes/_renderer.tsx` → Global renderer/layout
- `app/routes/_404.tsx` → Not found handler
- `app/routes/_error.tsx` → Error handler

Use semantic dynamic params (`[slug]`, `[path]`, `[id]`) consistently per domain.

## Entry Points

### app/server.ts

```ts
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp();
showRoutes(app);

export default app;
```

### app/client.ts

```ts
import { createClient } from "honox/client";

createClient();
```

Prefer `createClient()` for HonoX 0.1.x-style client bootstrap.

## Rendering & Layout Rules

Keep `_renderer.tsx` as the single source of shared HTML shell concerns:

- `<Link href='/app/style.css' rel='stylesheet' />`
- `<Script src='/app/client.ts' async />`
- Shared layout (`Header`, `Footer`, main container)
- Common OGP/Twitter defaults
- Optional analytics initialization via env binding

Define route-level `<title>` and `<meta>` inside page routes and let head aggregation handle output.

## Islands Rules

- Put interactive components in `app/islands/`
- Import islands from server-rendered routes/components
- Hydrate only where interaction is required

```ts
import InteractiveFilter from "../../islands/interactive-filter";
```

### Do

- Keep islands small and focused
- Keep state local unless cross-island sharing is truly needed

### Don't

- Do not island-ize static markup
- Do not move server-only logic into islands

## Data Access Pattern (Storage + Cache API)

Use one dedicated adapter module (e.g. `app/lib/storage.ts`) for all storage reads/writes:

- `getItem(storage, key, options)`
- `listItems(storage, options)`
- `getAsset(storage, path, options)`

Recommended behavior:

- Use Cache API for edge caching (`caches.open(...)`)
- Use `ExecutionContext` + `ctx.waitUntil` for non-blocking cache writes
- Use explicit `Result<T, E>`-style returns for recoverable failures
- Resolve success/error branches at route level

## API Route Pattern

For asset/data proxy routes:

- Normalize/validate route params
- Fetch through adapter (`getAsset`/`getItem`)
- Add observability headers like `X-Cache: HIT|MISS`
- Set `Content-Type` / `ETag` / `Cache-Control` when available
- Return `c.notFound()` for missing objects

## Error Handling

- `_404.tsx`: `NotFoundHandler`
- `_error.tsx`: `ErrorHandler`
  - If error already exposes a response, return it directly
  - Otherwise return 500 with safe fallback UI

## Env & Types

Define runtime bindings in `app/global.d.ts`:

```ts
Bindings: {
  STORAGE_BUCKET: R2Bucket
  ANALYTICS_ID?: string
}
```

Always update type declarations when adding/changing worker bindings.

## Development Commands

```bash
pnpm run dev
pnpm run test
pnpm run typecheck
pnpm run lint
pnpm run format
pnpm run build
pnpm run deploy
```

## Reusable Implementation Checklist

1. Keep route naming and dynamic segment conventions consistent
2. Add interactivity via `app/islands` first, not mixed server files
3. Centralize storage/data access behind one adapter module
4. Preserve framework-level not-found/error flow
5. Keep shared head/layout logic in `_renderer.tsx`
6. Keep route-level SEO metadata close to each route
7. Add/maintain tests for parsing/storage utilities when behavior changes

## References

- [HonoX GitHub](https://github.com/honojs/honox)
- [Hono Documentation](https://hono.dev/)
- [Vite Documentation](https://vitejs.dev/)
