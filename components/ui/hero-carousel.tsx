// A full-bleed editorial hero driven by a filmstrip.
//
// Every card shares one top edge. The focused card unfurls to full height while
// its neighbours stay clipped to half, so the strip reads as a row of cropped
// heads with one complete portrait standing in the middle of it. Changing the
// focus re-grades the whole background to that image.
//
// Geometry is measured, never hard-coded: one ResizeObserver reads the stage and
// every size below is a ratio of it, so the same component is pixel-identical in
// a 600px preview box and on a 4K display.
import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"

import { cn } from "@/lib/utils"

export interface HeroCarouselItem {
  /** Stable key; falls back to the index. @default undefined */
  id?: string | number
  /** Headline for the active slide. Newlines become separate reveal lines. */
  title: string
  /** Full-size image. Used in the lightbox, where detail is the point. */
  image: string
  /**
   * Small version of the same image for the strip and the background. A card
   * ~200px wide handed a 1122px file still decodes the whole thing: fourteen
   * of those is tens of megabytes of bitmap the compositor has to carry on
   * every frame of the drag. Falls back to `image`. @default undefined
   */
  thumb?: string
  /** Byline printed beside the headline, e.g. "BY AURELIA STUDIO." @default undefined */
  credit?: string
  /** Right-aligned facts, e.g. ["SAT NOV 15", "5-10 PM", "MIAMI"]. @default undefined */
  meta?: string[]
  /**
   * CSS colour the background is graded to. The photo keeps its luminance and
   * takes this hue, which is what makes the backdrop swing on every change.
   * @default "#8a8a8a"
   */
  accent?: string
  /**
   * Which band of the image the half-height neighbours keep, as a CSS
   * object-position. Only matters when `fit` is "cover".
   * @default "50% 26%"
   */
  focal?: string
}

export interface HeroCarouselProps {
  /** Slides, in strip order. */
  items: HeroCarouselItem[]
  /** Focused slide when controlled. Leave unset for internal state. @default undefined */
  index?: number
  /** Focused slide on mount when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Fires on every focus change, from any input. @default undefined */
  onIndexChange?: (index: number) => void
  /** Wordmark in the middle of the top bar. @default undefined */
  brand?: React.ReactNode
  /**
   * Fixed line above the rotating headline. Stays put while the slides change,
   * so it can carry the page's own <h1> — the slide titles are <h2> and swap
   * on every step, which no heading outline should do. @default undefined
   */
  eyebrow?: React.ReactNode
  /**
   * Slot pinned to the bottom-right, opposite the position rail. Meant for the
   * page's primary action, so a full-bleed hero isn't a dead end. @default undefined
   */
  cta?: React.ReactNode
  /** Renders the "Back" control when provided. @default undefined */
  onBack?: () => void
  /** Renders the "Menu" control when provided. @default undefined */
  onMenu?: () => void
  /** Advance on a timer. Pauses on hover, drag and focus. @default false */
  autoplay?: boolean
  /** Milliseconds between autoplay steps. @default 4000 */
  autoplayDelay?: number
  /** Accessible name for the carousel region. @default "Destaques" */
  ariaLabel?: string
  /**
   * Heading level for the slide title. Drop it to "h3" when the section around
   * the carousel already owns an h2, so the page outline stays in order.
   * @default "h2"
   */
  titleAs?: "h2" | "h3"
  /**
   * Step the strip with the wheel/trackpad. The handler calls preventDefault,
   * which is fine for a hero that owns the viewport but turns a mid-page
   * section into a scroll trap: the reader has to click through every card
   * before the page moves again. Turn it off away from the top of the page.
   * @default true
   */
  wheelNavigation?: boolean
  /**
   * Card width ÷ card height. The original is 3:4 portrait. Framed artwork
   * that isn't portrait gets guillotined at 0.75 — raise it towards 1 for
   * mixed orientations. @default 0.75
   */
  cardAspect?: number
  /**
   * "cover" fills the card and crops; "contain" fits the whole image inside it.
   * Use "contain" for artwork where the edges are part of the piece.
   * @default "cover"
   */
  fit?: "cover" | "contain"
  /**
   * Active card height ÷ stage height. The strip hangs from the middle of the
   * stage, so anything past ~0.45 runs off the bottom. @default 0.264
   */
  cardHeight?: number
  /**
   * Clicking the already-focused card opens it full size in an overlay.
   * Worth turning on whenever the image has detail the strip is too small to
   * show — artwork, maps, screenshots. @default false
   */
  lightbox?: boolean
  /**
   * Re-hue the backdrop to each slide's accent. Turn this off when the images
   * are artwork whose own colour matters — grading rewrites it.
   * @default true
   */
  grade?: boolean
  /** Extra classes for the stage. @default undefined */
  className?: string
}

/* Ratios lifted from the reference layout, all relative to the stage box. */
const CARD_H = 0.264 // active card height ÷ stage height
const GAP = 0.038 // gap ÷ card width
const STRIP_TOP = 0.5 // strip's shared top edge, down the stage
const TITLE = 0.067 // headline cap size ÷ stage height
const LABEL = 0.0103 // small mono label ÷ stage height
const PAD = 0.017 // page gutter ÷ stage width
const RAIL = 0.2 // progress rail width ÷ stage width

/** Wheel distance that commits to a step, and the lockout after one. */
const WHEEL_THRESHOLD = 60
const WHEEL_COOLDOWN = 420

/**
 * Drag in the lightbox that commits to a step: either a long enough pull, or
 * a flick. The flick still has to cover SWIPE_MIN, otherwise a tap with a
 * twitch in it registers as a swipe and the piece changes under the thumb.
 */
const SWIPE_DISTANCE = 60
const SWIPE_VELOCITY = 350
const SWIPE_MIN = 20

/* Film grain, as a self-contained SVG so the component carries no assets. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  eyebrow,
  cta,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4000,
  ariaLabel = "Destaques",
  titleAs = "h2",
  wheelNavigation = true,
  cardAspect = 0.75,
  cardHeight = CARD_H,
  lightbox = false,
  fit = "cover",
  grade = true,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const openerRef = React.useRef<HTMLElement | null>(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex)
  const [dragging, setDragging] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  const [zoomed, setZoomed] = React.useState(false)
  const reduced = useReducedMotion()

  const last = items.length - 1
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last))

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last))
      if (controlled === undefined) setUncontrolled(clamped)
      if (clamped !== index) onIndexChange?.(clamped)
    },
    [controlled, index, last, onIndexChange]
  )

  // One observer feeds every measurement below.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  const fullH = clamp(box.h * cardHeight, 96, 460)
  const halfH = fullH / 2
  const cardW = fullH * cardAspect
  const gap = Math.max(4, Math.round(cardW * GAP))
  const step = cardW + gap
  const pad = Math.max(16, Math.round(box.w * PAD))
  const label = Math.max(9, Math.round(box.h * LABEL))

  // Centre the focused card: the track slides, the card never moves itself.
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW]
  )
  const x = useMotionValue(0)
  const target = xFor(index)

  const swing = reduced
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const }
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.9 }

  // The track is driven by a motion value rather than an `animate` prop so a
  // drag that starts mid-spring reads the real position, not where the spring
  // was headed - otherwise the release snaps a card off.
  React.useEffect(() => {
    if (dragging) return
    const run = animate(x, target, spring)
    return () => run.stop()
    // `spring` is a literal, so `reduced` (all it derives from) stands in for it.
  }, [target, dragging, reduced, x]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel and trackpad. Both axes step the strip.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage || !wheelNavigation) return
    let acc = 0
    let until = 0

    const onWheel = (e: WheelEvent) => {
      // Trackpads report the dominant axis; take whichever is stronger.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      // Scroll chaining: once the strip is against an end, hand the gesture
      // back to the page. Without this a full-height carousel is a scroll trap
      // with no way past it.
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0)
      if (stuck) {
        acc = 0
        return
      }
      e.preventDefault()
      const now = e.timeStamp
      if (now < until) return
      acc += delta
      if (Math.abs(acc) < WHEEL_THRESHOLD) return
      go(index + Math.sign(acc))
      acc = 0
      until = now + WHEEL_COOLDOWN
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [go, index, last, wheelNavigation])

  React.useEffect(() => {
    if (!autoplay || paused || dragging || zoomed || items.length < 2) return
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay
    )
    return () => window.clearTimeout(id)
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused, zoomed])

  /**
   * Enquanto o visualizador está aberto ele é dono do teclado e do scroll:
   * Esc fecha, as setas trocam de peça, e o fundo fica travado para a página
   * não rolar atrás do overlay. O foco vai para o botão de fechar e volta para
   * o card de origem depois — sem isso, quem navega por teclado é jogado de
   * volta para o topo da página ao fechar.
   */
  React.useEffect(() => {
    if (!zoomed) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setZoomed(false)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        go(index - 1)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        go(index + 1)
      }
    }

    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
      openerRef.current?.focus()
    }
  }, [zoomed, go, index])

  /**
   * Fechar clicando fora da imagem. Um fundo `absolute inset-0` não serve
   * aqui: as três faixas do overlay cobrem a tela inteira e ficariam por
   * cima dele. Cada faixa escuta o próprio clique e só fecha quando o alvo é
   * ela mesma — clique na imagem, nas setas ou no botão de fechar não conta.
   */
  const dismissOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setZoomed(false)
  }

  const active = items[index]
  if (!active) return null

  const lines = active.title.split("\n")
  const accent = active.accent ?? "#8a8a8a"
  const Title = motion[titleAs]

  return (
    <>
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        }
        if (!(e.key in keys)) return
        e.preventDefault()
        go(keys[e.key]!)
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[24rem] w-full overflow-hidden bg-black text-white select-none",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset",
        className
      )}
    >
      {/* ── Background: the focused photo, blown up and re-hued to its accent ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.img
            // O fundo fica atrás de um véu pesado, um degradê e o grão: a
            // versão pequena esticada é indistinguível da grande aqui.
            src={active.thumb ?? active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: reduced ? 1.28 : 1.42 }}
            animate={{ scale: 1.28 }}
            transition={reduced ? { duration: 0 } : { duration: 6, ease: "linear" }}
          />
          {grade ? (
            <>
              {/* Keep the photo's luminance, take the accent's hue. */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: accent, mixBlendMode: "color" }}
              />
              <div
                className="absolute inset-0 opacity-55"
                style={{ backgroundColor: accent, mixBlendMode: "multiply" }}
              />
            </>
          ) : (
            /* Sem grading: escurece o fundo e deixa o accent só como um brilho,
               para que a arte no card continue com a cor que o artista pintou.
               O véu é pesado de propósito — a arte ampliada atrás é cheia de
               detalhe e engolia o texto por cima dela. */
            <>
              <div className="absolute inset-0 bg-black/80" />
              <div
                className="absolute inset-0 opacity-30"
                style={{ backgroundColor: accent, mixBlendMode: "soft-light" }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legibility wash + grain, above the swap so they never flicker. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* ── Top bar: a centred cluster, not edge-to-edge ── */}
      {onBack || brand || onMenu ? (
        <div
          className="absolute inset-x-0 flex items-center justify-center"
          style={{
            top: Math.max(16, box.h * 0.029),
            gap: `${Math.max(20, box.w * 0.06)}px`,
          }}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="opacity-90 transition-opacity hover:opacity-100"
              style={{ fontSize: label * 1.15 }}
            >
              <span aria-hidden>↖</span> Back
            </button>
          ) : null}
          {brand ? (
            <div
              className="font-semibold tracking-[0.06em]"
              style={{ fontSize: label * 1.35 }}
            >
              {brand}
            </div>
          ) : null}
          {onMenu ? (
            <button
              type="button"
              onClick={onMenu}
              className="opacity-90 transition-opacity hover:opacity-100"
              style={{ fontSize: label * 1.15 }}
            >
              Menu <span aria-hidden>☰</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {/* ── Headline block, sitting just above the strip's top edge ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        {eyebrow ? (
          <div
            className="mb-3 font-mono uppercase tracking-[0.3em] opacity-70"
            style={{ fontSize: label }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div className="flex w-full flex-wrap items-end gap-x-[6vw] gap-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <Title
              key={index}
              className="font-semibold leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: Math.max(24, Math.round(box.h * TITLE)) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                // Each line wipes up from behind its own edge.
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </Title>
          </AnimatePresence>

          {active.credit ? (
            <motion.p
              key={`credit-${index}`}
              className="font-mono uppercase tracking-[0.14em] opacity-80"
              style={{ fontSize: label }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {active.credit}
            </motion.p>
          ) : null}

          {active.meta?.length ? (
            <div
              className="ml-auto flex items-end"
              style={{ gap: `${Math.max(16, box.w * 0.055)}px` }}
            >
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="font-mono whitespace-nowrap uppercase tracking-[0.14em] opacity-80"
                  style={{ fontSize: label }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.45, delay: 0.12 + i * 0.06 }
                  }
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── The strip: one shared top edge, the focused card twice as tall ── */}
      <div
        className="absolute inset-x-0"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false)
            // Land on whatever card the release sits nearest, nudged by throw
            // velocity so a flick clears more than one card.
            const thrown = x.get() + info.velocity.x * 0.12
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step))
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={
                lightbox && i === index
                  ? `Ampliar ${item.title.replace(/\n/g, " ")}`
                  : item.title.replace(/\n/g, " ")
              }
              aria-current={i === index}
              // Card de fora: foca. Card já focado: abre em tamanho real.
              onClick={(e) => {
                if (lightbox && i === index) {
                  openerRef.current = e.currentTarget
                  setZoomed(true)
                } else {
                  go(i)
                }
              }}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-none",
                // Com "contain" a arte é encaixada inteira e sobra borda: um
                // fundo escuro faz essa sobra parecer passe-partout, e não falha.
                fit === "contain" ? "bg-neutral-950" : "bg-white/5"
              )}
              style={{ width: cardW }}
              animate={{ height: i === index ? fullH : halfH }}
              transition={spring}
            >
              {/* With `fit="cover"` the focused card matches `cardAspect` exactly,
                  so object-position only picks which band of the image the
                  half-height neighbours keep. */}
              <img
                src={item.thumb ?? item.image}
                alt=""
                draggable={false}
                // Só as primeiras entram no carregamento inicial; o resto da
                // fita está fora da tela e pode esperar.
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "h-full w-full",
                  fit === "contain" ? "object-contain" : "object-cover"
                )}
                style={fit === "cover" ? { objectPosition: item.focal ?? "50% 26%" } : undefined}
              />
              {/* Unfocused cards sit back a touch without going grey. */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: i === index ? 0 : 0.12 }}
                transition={spring}
              />

              {/* Dica de ampliar. É um span, não um botão: o card inteiro já é
                  o botão, e botão dentro de botão é HTML inválido. */}
              {lightbox && i === index ? (
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/60 backdrop-blur-md"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M9 21H3v-6" />
                    <path d="M21 3l-7 7" />
                    <path d="M3 21l7-7" />
                  </svg>
                </motion.span>
              ) : null}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── Position rail ── */}
      <div
        className="absolute"
        style={{ left: pad, bottom: Math.max(14, box.h * 0.022), width: box.w * RAIL }}
      >
        <div
          className="flex justify-between font-mono tabular-nums opacity-80"
          style={{ fontSize: label }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="relative mt-2 h-px w-full bg-white/25">
          <motion.div
            className="absolute inset-y-0 bg-white"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>

      {/* ── Ação principal, no canto oposto ao trilho ── */}
      {cta ? (
        <div
          className="absolute"
          style={{ right: pad, bottom: Math.max(14, box.h * 0.022) }}
        >
          {cta}
        </div>
      ) : null}
    </div>

    {/* ── Visualizador: a peça em tamanho real, fora do fluxo da página ── */}
    <AnimatePresence>
      {zoomed ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title.replace(/\n/g, " ")}, ampliada`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-md"
        >
          <div
            onClick={dismissOnBackdrop}
            className="relative flex cursor-zoom-out items-center justify-between gap-4 px-5 py-4 sm:px-8"
          >
            <span className="font-mono tabular-nums text-[11px] tracking-[0.2em] text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Fechar visualizador"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            onClick={dismissOnBackdrop}
            className="relative flex min-h-0 flex-1 cursor-zoom-out items-center justify-center px-3 sm:px-16"
          >
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Peça anterior"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25 sm:left-5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            ) : null}

            {/*
              Arrastar para o lado troca de peça. As setas existem e funcionam
              no celular, mas ninguém procura por um botão de 44px na borda da
              tela quando a mão já está sobre a imagem.
              `dragConstraints` zerado deixa o gesto elástico e devolve a
              imagem ao lugar quando o arrasto é curto demais para valer.
            */}
            <motion.img
              key={active.image}
              src={active.image}
              alt={active.title.replace(/\n/g, " ")}
              draggable={false}
              drag={items.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                // Um empurrão rápido conta sem percorrer a distância cheia,
                // desde que tenha percorrido alguma.
                const distance = Math.abs(info.offset.x)
                const speed = Math.abs(info.velocity.x)
                const decisive =
                  distance > SWIPE_DISTANCE ||
                  (speed > SWIPE_VELOCITY && distance > SWIPE_MIN)
                if (!decisive) return
                go(info.offset.x < 0 ? index + 1 : index - 1)
              }}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full max-w-full cursor-grab object-contain active:cursor-grabbing"
            />

            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={index === last}
                aria-label="Próxima peça"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25 sm:right-5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ) : null}
          </div>

          <div
            onClick={dismissOnBackdrop}
            className="relative flex cursor-zoom-out flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-5 sm:px-8"
          >
            <p className="font-display text-2xl italic tracking-tight text-white sm:text-3xl">
              {active.title.replace(/\n/g, " ")}
            </p>
            {active.credit ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{active.credit}</p>
            ) : null}
            {active.meta?.length ? (
              <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                {active.meta.join(" · ")}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </>
  )
}
