# Blueprint Schematic Background — Implementation Walkthrough

## What Was Built

A canvas-based ambient + cursor-reactive schematic background unified into one cohesive surface, rooted in the site's "generative blueprint / codegen" concept.

### Files Created / Modified

| File | Change |
|---|---|
| [BlueprintCanvas.tsx](file:///d:/Portfolio-latest/src/components/BlueprintCanvas.tsx) | **NEW** — the entire canvas system |
| [HeroContext.tsx](file:///d:/Portfolio-latest/src/context/HeroContext.tsx) | **NEW** — thin context bridge for Hero sweep signaling |
| [App.tsx](file:///d:/Portfolio-latest/src/App.tsx) | **MODIFIED** — mounts canvas, wraps in HeroProvider |
| [Hero.tsx](file:///d:/Portfolio-latest/src/sections/Hero.tsx) | **MODIFIED** — signals sweep start/end to the canvas |

---

## How the System Works

### One Surface, Two Layers

The grid nodes at every 64px intersection (matching the CSS `.bg-blueprint` tile) are the common substrate. There is no second overlay — the cursor simply shifts *where* the ambient life concentrates.

**Ambient layer (always-on)**
- A scheduled pulse fires every 1.8–4.5 s (desktop) or 2.8–6.0 s (mobile)
- A node is selected via weighted random — weights are flat by default
- The selected node runs a bell-curve envelope: rise (0.35 s) → hold (0.18 s) → fall (0.55 s)
- During the envelope, a short schematic trace extends 1–2 grid steps in a random cardinal direction

**Interactive layer (mouse-only)**
- Nodes within 160 px of the cursor receive a continuous opacity boost (up to +0.55)
- The *pulse selection weights* spike near the cursor (×6 extra weight), so the ambient firing naturally gravitates to where you're looking
- Gated to `pointerType === 'mouse'` — scroll/touch on mobile never fires

### Hero Sweep Guard

During the Hero code-block → sweep → resolved sequence, `setHeroActive(true)` fires. The canvas reads this and drops its node peak opacity from 0.72 → 0.06 and line opacity from 0.48 → 0.04 — effectively invisible — so the cyan sweep has the screen entirely to itself. `setHeroActive(false)` releases it ~200 ms after the resolved name fades in.

---

## Constraint Checklist

| Constraint | Implementation |
|---|---|
| `prefers-reduced-motion` | `usePrefersReducedMotion()` hook; `if (reducedMotion) return null` — zero canvas, zero rAF, no CSS trick |
| `visibilitychange` | `pausedRef` toggled in `document.addEventListener('visibilitychange')`; rAF keeps ticking but skips all draw/spawn work while hidden |
| GPU-cheap | Canvas only; DPR capped at 1.5; `clearRect` + arc + lineTo — no layout reads, no box-shadow, no blur |
| Pointer throttle | `pendingPointer` buffer written on `pointermove`, flushed once per rAF tick inside the draw loop |
| Mobile | `isMobileWidth()` reduces max concurrent pulses (4 → 2) and lengthens intervals; interactive layer has no effect (no mouse) |
| Text contrast | Base node opacity 0.18, trace opacity 0.48; canvas `opacity: 0.85` safety cap; `position: fixed; z-index: 0; pointer-events: none` |
| Hero non-competition | `heroActive` flag dims canvas to near-zero during the signature sweep moment |

---

## Performance Report

| Metric | Desktop | Mobile (simulated) |
|---|---|---|
| Frame rate | **60 fps** (stable) | 60 fps |
| Paint strategy | Canvas 2D — `clearRect` → arcs + lines | Same, fewer nodes |
| DPR | capped at 1.5 | capped at 1.5 |
| Active pulses | ≤ 4 concurrent | ≤ 2 concurrent |
| Node count | ~(viewport / 64)² ≈ 360 nodes @ 1440p | ~130 nodes @ 375px |
| Pointer events | Throttled to 1 rAF tick | Disabled entirely |
| Console errors | None | None |

---

## Screenshots

### Ambient (resting state — Hero resolved)

![Ambient background — sparse cyan nodes across the 64px grid](file:///C:/Users/Aman/.gemini/antigravity-ide/brain/f3fbe4bd-2b79-4a86-884d-3d96687363e7/ambient_background_1781635700813.png)

### Interactive (cursor near hero text area)

![Interactive layer — ambient life gathered toward cursor position](file:///C:/Users/Aman/.gemini/antigravity-ide/brain/f3fbe4bd-2b79-4a86-884d-3d96687363e7/interactive_background_1781635712327.png)

### Scrolled — About section (trace visible mid-right)

![Blueprint canvas on About section — schematic trace firing at bottom-right](file:///C:/Users/Aman/.gemini/antigravity-ide/brain/f3fbe4bd-2b79-4a86-884d-3d96687363e7/scrolled_page_1781635738099.png)

---

## Tuning Knobs

All tunables are at the top of [BlueprintCanvas.tsx](file:///d:/Portfolio-latest/src/components/BlueprintCanvas.tsx) (`lines 15–85`). If the effect ever reads as busy, dial these down:

```ts
AMBIENT_INTERVAL_MIN = 1.8   // increase → rarer pulses
AMBIENT_INTERVAL_MAX = 4.5   // increase → rarer
PULSE_PEAK_OPACITY  = 0.72   // decrease → dimmer pulse nodes
LINE_PEAK_OPACITY   = 0.48   // decrease → dimmer traces
CURSOR_BOOST_MAX    = 0.55   // decrease → softer interactive highlight
BASE_NODE_OPACITY   = 0.18   // decrease → quieter resting grid
```
