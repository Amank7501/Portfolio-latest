/**
 * BlueprintCanvas
 *
 * A canvas-based ambient + cursor-reactive schematic background.
 * One cohesive surface: sparse node pulses and short connecting traces at
 * grid intersections — the cursor doesn't add a new effect, it concentrates
 * the existing one toward wherever you're looking.
 *
 * Design constraints:
 *  - prefers-reduced-motion → disabled entirely (JS gate, not CSS duration)
 *  - visibilitychange → RAF loop paused when tab is hidden
 *  - GPU-cheap: transform/opacity/canvas only; DPR capped at 1.5
 *  - Pointer handler throttled to one rAF tick, not per-event
 *  - Interactive layer gated to pointerType === 'mouse' (no touch/scroll trigger)
 *  - heroActive prop → damps global canvas opacity during Hero sweep sequence
 *  - Mobile: lighter node count, ambient only (no interactive layer)
 */

import { useEffect, useRef, useCallback } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// ─── tunables ────────────────────────────────────────────────────────────────

const GRID_SIZE = 64            // must match .bg-blueprint background-size

// Ambient timing (seconds)
const AMBIENT_INTERVAL_MIN = 1.8   // fastest a new pulse fires (desktop)
const AMBIENT_INTERVAL_MAX = 4.5   // slowest
const AMBIENT_INTERVAL_MOBILE_MIN = 2.8
const AMBIENT_INTERVAL_MOBILE_MAX = 6.0

// Pulse lifecycle (seconds)
const PULSE_RISE   = 0.35
const PULSE_HOLD   = 0.18
const PULSE_FALL   = 0.55
const PULSE_TOTAL  = PULSE_RISE + PULSE_HOLD + PULSE_FALL

// Visual limits
const CONNECT_MAX_SEGMENTS = 2   // max grid steps a trace extends
const BASE_NODE_RADIUS     = 1.5  // px (logical)
const PULSE_NODE_RADIUS    = 2.8

// Cursor influence
const CURSOR_RADIUS_PX    = 160   // logical px
const CURSOR_BOOST_MAX    = 0.55  // max extra opacity added by proximity
const CURSOR_PULSE_WEIGHT = 6.0   // how much cursor proximity biases pulse selection

const SIGNAL_RGB  = '77, 208, 225'   // #4dd0e1

// Desktop vs mobile node budget
const DESKTOP_ACTIVE_PULSES = 4   // max concurrent pulses
const MOBILE_ACTIVE_PULSES  = 2

// Base opacity caps
const BASE_NODE_OPACITY   = 0.18  // resting node dot
const PULSE_PEAK_OPACITY  = 0.72  // node at full pulse
const LINE_PEAK_OPACITY   = 0.48  // trace at full pulse

// Hero damping: while heroActive, these replace the caps
const HERO_NODE_OPACITY   = 0.06
const HERO_LINE_OPACITY   = 0.04

// ─── types ───────────────────────────────────────────────────────────────────

interface GridNode {
  col: number  // grid column index
  row: number  // grid row index
  x: number    // canvas logical x
  y: number    // canvas logical y
}

interface Pulse {
  nodeIdx: number          // index into nodes[]
  startTime: number        // performance.now() when spawned (ms)
  direction: [number, number]  // [dcol, drow] — direction of the trace
  segments: number         // how many grid steps the trace extends
}

interface CanvasState {
  nodes: GridNode[]
  pulses: Pulse[]
  nextPulseAt: number       // performance.now() (ms) of next scheduled pulse
  cursor: { x: number; y: number } | null
  pointerIsActive: boolean  // true once we've seen a real mouse event
  rafId: number | null
  pendingPointer: { x: number; y: number } | null  // rAF-throttled update
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

function isMobileWidth() {
  return window.innerWidth < 768
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t, 0, 1)
}

// Palette comment — Math.clamp is a Stage-3 proposal; we use our own clamp() above.

/** Smooth bell envelope: rises linearly, holds, falls linearly */
function pulseEnvelope(elapsed: number): number {
  if (elapsed < PULSE_RISE) return elapsed / PULSE_RISE
  if (elapsed < PULSE_RISE + PULSE_HOLD) return 1
  const fall = elapsed - PULSE_RISE - PULSE_HOLD
  return 1 - fall / PULSE_FALL
}

function randomBetween(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo)
}

/** Pick the next ambient interval (ms) based on viewport */
function nextInterval(mobile: boolean): number {
  const min = mobile ? AMBIENT_INTERVAL_MOBILE_MIN : AMBIENT_INTERVAL_MIN
  const max = mobile ? AMBIENT_INTERVAL_MOBILE_MAX : AMBIENT_INTERVAL_MAX
  return randomBetween(min, max) * 1000
}

/** Manhattan neighbours on the grid (up/down/left/right only) */
const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// ─── component ───────────────────────────────────────────────────────────────

interface BlueprintCanvasProps {
  /** Pass true while the Hero sweep is active to damp the background */
  heroActive?: boolean
}

export function BlueprintCanvas({ heroActive = false }: BlueprintCanvasProps) {
  const reducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef<CanvasState>({
    nodes: [],
    pulses: [],
    nextPulseAt: 0,
    cursor: null,
    pointerIsActive: false,
    rafId: null,
    pendingPointer: null,
  })
  const heroActiveRef = useRef(heroActive)
  const pausedRef = useRef(false)

  // Keep heroActiveRef in sync without triggering re-render
  useEffect(() => {
    heroActiveRef.current = heroActive
  }, [heroActive])

  // ── build node grid ────────────────────────────────────────────────────────
  const buildNodes = useCallback((canvas: HTMLCanvasElement): GridNode[] => {
    const cols = Math.ceil(canvas.width  / GRID_SIZE) + 2
    const rows = Math.ceil(canvas.height / GRID_SIZE) + 2
    const nodes: GridNode[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          col: c,
          row: r,
          x: c * GRID_SIZE,
          y: r * GRID_SIZE,
        })
      }
    }
    return nodes
  }, [])

  // ── spawn a new pulse ──────────────────────────────────────────────────────
  const spawnPulse = useCallback((
    state: CanvasState,
    now: number,
    mobile: boolean,
    logicalW: number,
    logicalH: number,
  ) => {
    const maxPulses = mobile ? MOBILE_ACTIVE_PULSES : DESKTOP_ACTIVE_PULSES
    if (state.pulses.length >= maxPulses) return

    const { nodes, cursor, pointerIsActive } = state

    // Build per-node weights: proximity to cursor biases selection
    const weights = nodes.map((n) => {
      if (n.x < 0 || n.y < 0 || n.x > logicalW + GRID_SIZE || n.y > logicalH + GRID_SIZE) return 0
      let w = 1
      if (cursor && pointerIsActive && !mobile) {
        const dx = n.x - cursor.x
        const dy = n.y - cursor.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_RADIUS_PX) {
          w += CURSOR_PULSE_WEIGHT * (1 - dist / CURSOR_RADIUS_PX)
        }
      }
      return w
    })

    // Weighted random pick
    const total = weights.reduce((a, b) => a + b, 0)
    if (total === 0) return
    let rand = Math.random() * total
    let pickedIdx = 0
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i]
      if (rand <= 0) { pickedIdx = i; break }
    }

    // Don't double-pulse a node that's already active
    if (state.pulses.some((p) => p.nodeIdx === pickedIdx)) return

    const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
    const segments = 1 + Math.floor(Math.random() * CONNECT_MAX_SEGMENTS)

    state.pulses.push({
      nodeIdx: pickedIdx,
      startTime: now,
      direction: dir,
      segments,
    })
  }, [])

  // ── draw one frame ─────────────────────────────────────────────────────────
  const drawFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    state: CanvasState,
    now: number,
    dpr: number,
    logicalW: number,
    logicalH: number,
    mobile: boolean,
  ) => {
    ctx.clearRect(0, 0, logicalW * dpr, logicalH * dpr)

    const { nodes, pulses, cursor, pointerIsActive } = state
    const hero = heroActiveRef.current

    // Build lookup: nodeIdx → envelope value (0 if not pulsing)
    const pulseEnv = new Float32Array(nodes.length)
    const expiredPulses: number[] = []

    for (let pi = 0; pi < pulses.length; pi++) {
      const p = pulses[pi]
      const elapsed = (now - p.startTime) / 1000
      if (elapsed >= PULSE_TOTAL) {
        expiredPulses.push(pi)
        continue
      }
      pulseEnv[p.nodeIdx] = Math.max(pulseEnv[p.nodeIdx], pulseEnvelope(elapsed))
    }

    // Remove expired pulses (iterate backwards for safe splice)
    for (let i = expiredPulses.length - 1; i >= 0; i--) {
      pulses.splice(expiredPulses[i], 1)
    }

    const nodePeakOp = hero ? HERO_NODE_OPACITY     : PULSE_PEAK_OPACITY
    const linePeakOp = hero ? HERO_LINE_OPACITY     : LINE_PEAK_OPACITY
    const baseNodeOp = hero ? HERO_NODE_OPACITY * 0.4 : BASE_NODE_OPACITY

    // ── draw traces ────────────────────────────────────────────────────────
    for (let pi = 0; pi < pulses.length; pi++) {
      const p = pulses[pi]
      const elapsed = (now - p.startTime) / 1000
      if (elapsed >= PULSE_TOTAL) continue
      const env = pulseEnv[p.nodeIdx]
      const origin = nodes[p.nodeIdx]
      const [dc, dr] = p.direction

      // Trace extends segment by segment
      for (let s = 0; s < p.segments; s++) {
        const x0 = (origin.x + dc * GRID_SIZE * s)       * dpr
        const y0 = (origin.y + dr * GRID_SIZE * s)       * dpr
        const x1 = (origin.x + dc * GRID_SIZE * (s + 1)) * dpr
        const y1 = (origin.y + dr * GRID_SIZE * (s + 1)) * dpr

        // Clip to canvas bounds
        if (x1 < 0 || y1 < 0 || x0 > logicalW * dpr || y0 > logicalH * dpr) break

        // Cursor boost on the endpoint node (if in range)
        let cursorBoost = 0
        if (cursor && pointerIsActive && !mobile) {
          const endX = origin.x + dc * GRID_SIZE * (s + 1)
          const endY = origin.y + dr * GRID_SIZE * (s + 1)
          const dx = endX - cursor.x
          const dy = endY - cursor.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_RADIUS_PX) {
            cursorBoost = CURSOR_BOOST_MAX * (1 - dist / CURSOR_RADIUS_PX)
          }
        }

        const opacity = Math.min(1, lerp(0, linePeakOp, env) + cursorBoost)
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.strokeStyle = `rgba(${SIGNAL_RGB}, ${opacity})`
        ctx.lineWidth = 1 * dpr
        ctx.stroke()
      }
    }

    // ── draw nodes ─────────────────────────────────────────────────────────
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      // Cull off-screen nodes
      if (n.x < -GRID_SIZE || n.y < -GRID_SIZE || n.x > logicalW + GRID_SIZE || n.y > logicalH + GRID_SIZE) continue

      const env = pulseEnv[i]

      // Cursor proximity boost for this node
      let cursorBoost = 0
      if (cursor && pointerIsActive && !mobile) {
        const dx = n.x - cursor.x
        const dy = n.y - cursor.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_RADIUS_PX) {
          cursorBoost = CURSOR_BOOST_MAX * (1 - dist / CURSOR_RADIUS_PX)
        }
      }

      const baseOpacity = baseNodeOp + cursorBoost
      const pulseExtra  = env > 0 ? lerp(0, nodePeakOp - baseNodeOp, env) : 0
      const opacity     = Math.min(1, baseOpacity + pulseExtra)
      const radius      = lerp(BASE_NODE_RADIUS, PULSE_NODE_RADIUS, env) * dpr

      ctx.beginPath()
      ctx.arc(n.x * dpr, n.y * dpr, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${SIGNAL_RGB}, ${opacity})`
      ctx.fill()
    }
  }, [])

  // ── main loop ──────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const state = stateRef.current

    const dpr      = Math.min(window.devicePixelRatio || 1, 1.5)
    let logicalW   = window.innerWidth
    let logicalH   = window.innerHeight
    let mobile     = isMobileWidth()

    const resize = () => {
      logicalW = window.innerWidth
      logicalH = window.innerHeight
      mobile   = isMobileWidth()
      canvas.width  = logicalW * dpr
      canvas.height = logicalH * dpr
      state.nodes = buildNodes(canvas)
      // Invalidate any out-of-bounds pulses
      state.pulses = state.pulses.filter(
        (p) => p.nodeIdx < state.nodes.length,
      )
    }
    resize()

    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(document.documentElement)

    const tick = (now: number) => {
      if (pausedRef.current) {
        state.rafId = requestAnimationFrame(tick)
        return
      }

      // Flush pending pointer update
      if (state.pendingPointer) {
        state.cursor = state.pendingPointer
        state.pendingPointer = null
      }

      // Schedule next ambient pulse
      if (now >= state.nextPulseAt) {
        spawnPulse(state, now, mobile, logicalW, logicalH)
        state.nextPulseAt = now + nextInterval(mobile)
      }

      drawFrame(ctx, state, now, dpr, logicalW, logicalH, mobile)
      state.rafId = requestAnimationFrame(tick)
    }

    state.nextPulseAt = performance.now() + randomBetween(300, 900)
    state.rafId = requestAnimationFrame(tick)

    return () => {
      if (state.rafId !== null) cancelAnimationFrame(state.rafId)
      resizeObs.disconnect()
    }
  }, [buildNodes, spawnPulse, drawFrame])

  // ── pointer tracking (mouse-only, rAF-throttled) ───────────────────────────
  const setupPointer = useCallback(() => {
    const state = stateRef.current
    let rafPending = false

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      state.pointerIsActive = true
      // Queue the position; resolved in the next rAF tick
      state.pendingPointer = { x: e.clientX, y: e.clientY }
      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(() => { rafPending = false })
      }
    }

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      state.cursor = null
      state.pendingPointer = null
    }

    window.addEventListener('pointermove',  onPointerMove,  { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove',  onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  // ── visibility pause ────────────────────────────────────────────────────────
  useEffect(() => {
    const onVis = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // ── boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return   // entire system off under reduced-motion

    const cleanupLoop    = startLoop()
    const cleanupPointer = setupPointer()

    return () => {
      cleanupLoop?.()
      cleanupPointer?.()
    }
  }, [reducedMotion, startLoop, setupPointer])

  // Under reduced-motion, render nothing (static grid from CSS remains)
  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        // Never let the canvas compete with text: very low composite opacity.
        // The individual draw calls keep opacity even lower; this is a safety cap.
        opacity: 0.85,
      }}
    />
  )
}
