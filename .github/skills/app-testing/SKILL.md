---
name: app-testing
description: Core Skill. Minimal unit testing toolkit using Vitest for local web applications. Focuses on essential test coverage for critical functionality.
---

# Application Testing

- Test business logic and critical functions only
- When connecting to API, tests for both **normal and abnormal cases**
- Skip UI components and trivial code
- Place `*.test.ts(x)` adjacent to source files
- Enable aliases using `vite-tsconfig-paths`

**NOTE**:

- Since Vitest depends on Vite via dependencies, there's no need to install Vite directly.
- You can also write configuration files in `vitest.config.ts` instead of `vite.config.ts`.
- It can be said that Vitest itself is designed to be usable without requiring much awareness of Vite's presence.

## Decision Tree: Choosing Your Test Approach

```
User task → What needs testing?
    ├─ Pure logic/utils → Unit test with Vitest (no browser needed)
    │
    ├─ Component rendering → Vitest + @testing-library/react (rarely needed)
    │
    └─ Full integration → Vitest + Playwright (rarely needed)
```

## Vitest Unit Testing (Primary Approach)

### Example: Minimal Essential Tests

```typescript
// math.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./math";

describe("calculateTotal", () => {
  it("handles empty cart", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("applies discount correctly", () => {
    expect(calculateTotal([{ price: 100 }], 0.1)).toBe(90);
  });

  it("throws on negative prices", () => {
    expect(() => calculateTotal([{ price: -10 }])).toThrow();
  });
});
```

### Component Testing(rarely needed)

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables when loading', () => {
    render(<Button loading>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## Running Tests

```bash
# Run all tests
pnpm run test

# Watch mode during development
pnpm run test -- --watch

# Coverage report (optional)
pnpm run test -- --coverage
```

## Integration Testing (When Necessary)

For critical user flows that **must** work end-to-end using Playwright:

```typescript
// checkout.e2e.test.ts
import { test, expect } from "@playwright/test";

test("completes checkout flow", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.getByRole("link", { name: "Checkout" }).click();
  await expect(page.getByText("Order Complete")).toBeVisible();
});
```

Run integration tests:

```bash
pnpm run test:e2e
```

## Best Practices

- Test behavior, not implementation - Don't test internal state
- One assertion per concept - Keep tests focused
- Descriptive test names - "it('shows error when email invalid')"
- Avoid test interdependence - Each test should run independently
- Mock external dependencies - APIs, timers, file system

## What **NOT** to Test

- Framework internals (React, Vue rendering logic)
- Third-party libraries (assume they work)
- CSS/styling details
- Trivial code (simple getters, obvious mappings)
