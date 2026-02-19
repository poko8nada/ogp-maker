---
name: frontend-design
description: Core Skill. Create distinctive, production-level frontend interfaces with high design quality. This skill is used when users request the construction of web components, pages, artifacts, or applications (e.g., websites, landing pages, dashboards, React components, HTML/CSS layouts, or styling/beautifying web UIs). It avoids generic AI aesthetics, generating creative and sophisticated code and UI designs. It also includes guidelines, such as those for Tailwind CSS.
---

# Frontend Design Skill

## Core Principles

- Creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.
- Implement real working code with exceptional attention to aesthetic details and creative choices.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**:

- Choose a clear conceptual direction and execute it with precision.
- Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**:
  - Choose fonts that are beautiful, unique, and interesting.
  - Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices.
  - Pair a distinctive display font with a refined body font.
- **Color & Theme**:
  - Commit to a cohesive aesthetic.
  - Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**:
  - Leverage animation for effects and microinteractions. Prioritize CSS-only solutions in HTML.
  - A single, skillfully composed page load with staged reveals via animation delays delivers greater delight than scattered microinteractions.
  - Incorporate surprise effects for scroll triggers and hover states.
- **Backgrounds & Visual Details**:
  - Create atmosphere and depth. Add contextual effects and textures that match the overall aesthetic.
  - Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), and cookie-cutter design that lacks context-specific character.

**IMPORTANT**: Match implementation complexity to the aesthetic vision.

- Maximalist designs need elaborate code with extensive animations and effects.
- Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details.
- Elegance comes from executing the vision well.

Remember: You are capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Basic Stack

Tailwind CSS v4 is the default CSS framework.

- **CSS variables via `@theme` directive** for all custom design tokens
- **Respect Tailwind defaults** for typography, spacing, responsive breakpoints
- Component libraries are built on Tailwind - follow their conventions
- Avoid overriding built-in accessibility features

### Structure

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  /* Colors */
  --color-primary-500: #0ea5e9;
  --color-terminal-gold: #f4bf4f;
  --color-terminal-cyan: #4fb4d8;
  --color-terminal-bg: #1a1a1a;

  /* Semantic colors */
  --color-success: #10b981;
  --color-error: #ef4444;
}

/* Custom utilities */
.glow {
  box-shadow: 0 0 10px var(--color-terminal-cyan);
}
```

### Colors (Primary Customization Area)

Define color tokens in `@theme inline` block:

- Primary, secondary, accent colors (hex codes)
- Neutral scale (gray-50 to gray-900)
- Semantic colors (success, warning, error, info)
- **Ensure contrast ratios**: minimum 4.5:1 (text), 3:1 (UI components)

### Usage in Components

```tsx
<div className="bg-terminal-bg text-terminal-fg">
  <h1 className="text-terminal-gold glow">Terminal Style</h1>
</div>
```

### Best Practices

#### Do's ✓

- Define all design tokens in `@theme inline`
- Use Tailwind utilities (`bg-primary-500`, `text-terminal-gold`)
- Leverage responsive prefixes (`md:`, `lg:`)
- Use semantic naming (`--color-success`, not `--color-green`)

#### Don'ts ✗

- Don't duplicate definitions in CSS and config
- Don't create utility classes that duplicate Tailwind
- Don't hardcode colors in CSS (use CSS variables)
- Don't use `!important` (use Tailwind's specificity)
