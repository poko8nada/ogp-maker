---
title: TypeScript Utility Types You Should Know
createdAt: 2024-03-22
updatedAt: 2024-03-22
version: 1
isPublished: true
tags:
  - program
  - Nextjs
  - bugfix
---

## Partial

Makes all properties optional:

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;

const update: PartialUser = { email: "new@example.com" };
```

## Required

Makes all properties required:

```typescript
type RequiredUser = Required<PartialUser>;
```

## Pick

Selects specific properties:

```typescript
type UserPreview = Pick<User, "name" | "email">;
```

## Omit

Excludes specific properties:

```typescript
type UserWithoutAge = Omit<User, "age">;
```

## Record

Creates an object with specific keys:

```typescript
type Status = "pending" | "completed" | "failed";

type TaskStatus = Record<Status, number>;

const status: TaskStatus = {
  pending: 5,
  completed: 10,
  failed: 2,
};
```

## Readonly

Makes properties read-only:

```typescript
type ReadonlyUser = Readonly<User>;
```

## Conclusion

These utility types help write cleaner, more maintainable TypeScript code.
