---
name: hono-api-architecture
description: Core Skill. Hono API architecture guidelines for Cloudflare Workers with module boundaries, request validation, resource existence checks, Result-based error flow, layered caching, and testable route composition. Use when building or refactoring Hono APIs, edge image/data endpoints, or Worker-first backend services.
---

# Hono API Architecture Guidelines

Use this skill as a reusable architecture baseline for Hono APIs running on Cloudflare Workers.
It is abstracted from a production-shaped OGP generation service and generalized for broader API use.

## Recommended Baseline

- Runtime: Cloudflare Workers
- Framework: Hono 4.x
- Language: TypeScript (strict mode)
- Testing: Vitest
- Quality tools: Biome + `tsc --noEmit`

## Project Shape (Reusable)

```txt
src/
├── index.ts            # Route entrypoint and orchestration
├── utils/
│   └── types.ts        # Result<T, E> and helpers
├── [domain]/
│   ├── validate.ts     # Input normalization and validation
│   ├── cache.ts        # Cache read/write adapter
│   ├── error.ts        # Error-to-response mapping
│   ├── render.ts       # Domain core processing (optional)
│   ├── [domain].test.ts
│   └── ...
└── assets.d.ts         # Static asset module declarations
```

## Route Orchestration Pattern

Implement handlers as a clear pipeline:

1. Parse request input (`c.req.query()` / params / body).
2. Validate and normalize input in a dedicated module.
3. Check domain preconditions (for example, storage/resource existence).
4. Attempt cache hit with a deterministic request key.
5. Execute core processing only on cache miss.
6. Return typed success response with explicit headers.
7. Write cache asynchronously with `c.executionCtx.waitUntil`.
8. Convert failures to stable HTTP error responses.

This keeps `index.ts` as orchestration, while domain modules remain focused and testable.

## Validation and Domain Guards

- Keep validation in `validate.ts`; return `Result<T, E>` rather than throwing.
- Normalize inputs (`trim`, defaults) before checking constraints.
- Prefer explicit domain rules (allowed characters, length limits, required fields).
- Resolve resource existence checks early (for example, `R2Bucket.head`) and map to `404`.

## Error Model

- Define a small domain error union (for example: `bad_request | not_found | internal`).
- Map domain error type to status in one place (`error.ts`).
- In route handlers, catch unexpected exceptions, `console.error(error)`, and return internal error response.
- Do not leak low-level error details to clients.

## Caching Pattern (Layered)

Use three layers when latency/cost matters:

1. Dependency cache (for example, downloaded fonts or upstream artifacts).
2. Generated response cache (Cache API, key by full URL or canonical request).
3. CDN cache headers (`Cache-Control: public, max-age=31536000, immutable`) for repeat traffic.

Rules:

- On hit: return cached response immediately.
- On miss: compute response, then cache with cloned response.
- Keep cache module thin (`getCached*`, `putCached*`) and side-effect free beyond Cache API.

## External Dependency Boundaries

- Keep remote fetch logic in dedicated adapters (for example, `font.ts`).
- Parse upstream payloads deterministically and return typed errors when parsing fails.
- Reuse Cache API to avoid repeated upstream calls.

## Worker Configuration Rules

- Keep all Worker bindings typed via generated `worker-configuration.d.ts`.
- Use explicit environment bindings in app type parameter:
  - `new Hono<{ Bindings: CloudflareBindings }>()`
- Add Wrangler `rules` for binary assets when needed (`**/*.png` as `Data`).
- Maintain `.d.ts` declarations for non-TS imports (Wasm/assets).

## Testing Strategy

### Unit tests (domain modules)

- Validate input boundaries (valid/invalid).
- Validate storage existence check behavior (`true/false` branches).
- Validate cache adapter behavior (hit/miss).

### Route behavior tests

- Use `app.request(...)` to test full route flow.
- Mock domain modules to isolate orchestration decisions.
- Cover:
  - cache hit short-circuit
  - validation failure (`400`)
  - resource miss (`404`)
  - unexpected failure (`500`)

## Implementation Checklist

1. Separate orchestration (`index.ts`) from domain modules.
2. Use `Result<T, E>` for recoverable domain failures.
3. Keep validation and error mapping as dedicated modules.
4. Add precondition checks before expensive processing.
5. Add cache hit path before core processing.
6. Write cache asynchronously with `waitUntil`.
7. Return explicit `Content-Type` and cache headers.
8. Add tests for happy path and failure branches.
9. Run `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`.

## References

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
