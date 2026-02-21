---
title: Understanding React Hooks - A Deep Dive
createdAt: 2024-02-03
updatedAt: 2024-02-03
version: 1
isPublished: true
tags:
  - program
  - markdown
  - diary
---

## What are Hooks?

React Hooks let you use state and other React features in functional components. They were introduced in React 16.8 and have become the standard way to write components.

## Common Hooks

### useState

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useEffect

```jsx
useEffect(() => {
  console.log("Component mounted or updated");

  return () => {
    console.log("Cleanup function");
  };
}, [dependency]);
```

### useContext

Context allows you to share state across multiple components without prop drilling.

```jsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Header />
    </ThemeContext.Provider>
  );
}
```

## Key Takeaways

- Use hooks for side effects and state management
- Dependency arrays control when hooks run
- Custom hooks help reuse logic
