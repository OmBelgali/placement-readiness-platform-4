# KodNest Premium Build System

A premium SaaS design system for B2C product. Calm, intentional, coherent, confident.

---

## Design Philosophy

- **Calm** — No visual noise, no animation overload
- **Intentional** — Every element has purpose
- **Coherent** — One mind designed it; no visual drift
- **Confident** — Strong typography, generous spacing

**Avoid:** Gradients, glassmorphism, neon colors, playful/hackathon aesthetics, animation noise.

---

## Color System

| Token | Value | Use |
|-------|-------|-----|
| Background | `#F7F6F3` | Off-white page background |
| Primary text | `#111111` | Body, headings |
| Accent | `#8B0000` | Primary actions, links, focus |
| Success | `#4A7C59` | Shipped, completed states |
| Warning | `#B8860B` | In progress, caution |

**Rule:** Maximum 4 colors across the entire system. Use opacity for variants.

---

## Typography

| Element | Font | Size | Line height |
|---------|------|------|-------------|
| Headings | Serif (Georgia) | Large, confident | 1.3 |
| Body | Sans-serif (Segoe UI) | 16–18px | 1.6–1.8 |
| Caption | Sans-serif | 14px | 1.5 |

- **Max text width:** 720px for body text blocks
- **No decorative fonts, no random sizes**

---

## Spacing Scale

| Token | Value |
|-------|-------|
| `--kn-space-xs` | 8px |
| `--kn-space-sm` | 16px |
| `--kn-space-md` | 24px |
| `--kn-space-lg` | 40px |
| `--kn-space-xl` | 64px |

**Rule:** Never use random spacing (e.g. 13px, 27px). Whitespace is part of design.

---

## Global Layout Structure

Every page must follow this order:

```
[Top Bar]
    → [Context Header]
        → [Primary Workspace (70%) + Secondary Panel (30%)]
            → [Proof Footer]
```

### Top Bar

- **Left:** Project name
- **Center:** Progress indicator (Step X / Y)
- **Right:** Status badge (Not Started | In Progress | Shipped)

### Context Header

- Large serif headline
- 1-line subtext
- Clear purpose, no hype language

### Primary Workspace (70%)

- Main product interaction
- Clean cards, predictable components
- No crowding

### Secondary Panel (30%)

- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent)

Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed  
Each checkbox requires user proof input.

---

## Component Rules

| Component | Specification |
|-----------|---------------|
| Primary button | Solid deep red (`--kn-accent`) |
| Secondary button | Outlined, transparent fill |
| Hover | Same effect everywhere |
| Border radius | 6px consistent |
| Inputs | Clean borders, no heavy shadows, clear focus state |
| Cards | Subtle border, no drop shadows, balanced padding |

---

## Interaction Rules

- **Transitions:** 150–200ms, ease-in-out
- **No bounce, no parallax**

---

## Error & Empty States

### Errors

- Explain what went wrong
- Explain how to fix
- Never blame the user

### Empty States

- Provide next action
- Never feel dead

---

## File Structure

```
design-system/
├── tokens.css      # Colors, typography, spacing, layout tokens
├── base.css        # Reset, typography base
├── layout.css      # Top bar, header, workspace, panel, footer
├── components.css  # Buttons, inputs, cards, prompts, badges
├── index.css       # Master import
└── DESIGN_SYSTEM.md
```

---

## Usage

```html
<link rel="stylesheet" href="design-system/index.css">
```

Or in your build:

```css
@import "./design-system/index.css";
```

---

*KodNest Premium Build System — One mind. No drift.*
