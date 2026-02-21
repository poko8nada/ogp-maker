---
title: Web Accessibility Guide - Making Your Site Inclusive
createdAt: 2024-08-27
updatedAt: 2024-08-27
version: 1
isPublished: true
tags:
  - design
  - markdown
  - program
---

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## WCAG Standards

Web Content Accessibility Guidelines (WCAG) provide guidelines for accessibility:

- A: Basic level
- AA: Recommended level
- AAA: Enhanced level

## Semantic HTML

Use proper HTML elements:

```html
<!-- Good -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
  </article>
</main>
<footer>...</footer>

<!-- Bad -->
<div class="header">
  <div class="nav">...</div>
</div>
```

## ARIA Attributes

Provide context for screen readers:

```html
<button aria-label="Close menu">×</button>
<div role="alert">Error message</div>
<img alt="Descriptive text" />
```

## Keyboard Navigation

- Use Tab for navigation
- Ensure focus is visible
- Support Enter/Space for buttons
- Support Arrow keys for menus

## Color and Contrast

- Minimum contrast ratio: 4.5:1
- Don't rely on color alone
- Test with color blindness tools

## Tools

- Axe DevTools
- Lighthouse
- WAVE
- Screen readers (NVDA, JAWS)

## Checklist

- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Keyboard accessible
- [ ] Color contrast sufficient
- [ ] Form labels associated
- [ ] Focus indicators visible
