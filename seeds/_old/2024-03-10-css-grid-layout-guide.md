---
title: CSS Grid Layout - Complete Guide
createdAt: 2024-03-10
updatedAt: 2024-03-10
version: 1
isPublished: true
tags:
  - design
  - program
  - markdown
---

## Introduction to CSS Grid

CSS Grid is a powerful layout tool that allows you to create two-dimensional layouts with rows and columns.

## Basic Grid Setup

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}

.header {
  grid-column: 1 / -1;
}

.sidebar {
  grid-row: 2;
}

.main {
  grid-column: 2;
  grid-row: 2;
}

.footer {
  grid-column: 1 / -1;
}
```

## Responsive Grid

```css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .header {
    grid-column: 1;
  }

  .sidebar {
    display: none;
  }
}
```

## Auto-fit and Auto-fill

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
```

## Benefits

- Clean HTML structure
- Powerful responsive capabilities
- Two-dimensional layout control
