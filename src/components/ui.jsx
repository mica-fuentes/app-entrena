import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useDragControls, useReducedMotion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icons'
import Character from './Character'
import { fmt } from '../lib/format'

export const TAP = { scale: 0.97 }
const MLink = motion.create(Link)

// Contextos que arma App: dónde se dibujan hojas/toasts y hacia dónde va la transición
export const OverlayCtx = createContext(null)
export const PageCtx = createContext({ dir: 1, type: 'PUSH' })

/* ---------- Pantalla: scroll propio, transición y memoria de scroll ---------- */
const pageVariants = {
  enter: (d) => ({ x: d * 24, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.2, 0.8, 0.2, 1] } },
  exit: (d) => ({ x: d * -24, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
}
const scrollMemory = {}

export function Screen({ children, nav = true, action, className = '', dark = false, label }) {
  const loc = useLocation()
  const { dir, type } = useContext(PageCtx)
  const ref = useRef(null)
  // al volver para atrás, se recupera el scroll; si no, arranca arriba
  useLayoutEffect(() => {
    if (type === 'POP' && scrollMemory[loc.key]) ref.current.scrollTop = scrollMemory[loc.key]
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div
      ref={ref}
      className={`page${dark ? ' dark-page' : ''}`}
      custom={dir} variants={pageVariants} initial="enter" animate="center" exit="exit"
      onScroll={(e) => { scrollMemory[loc.key] = e.currentTarget.scrollTop }}
    >
      <main className={`screen${nav ? '' : ' no-nav'}${action ? ' has-action' : ''} ${className}`} aria-label={label}>
        {children}
        {action && <div className="action-bar">{action}</div>}
      </main>
    </motion.div>
  )
}

/* ---------- Atrás: chevron + nombre de la pantalla anterior ---------- */
export function useBack(fallback = '/hoy') {
  const nav = useNavigate()
  return () => (window.history.state?.idx > 0 ? nav(-1) : nav(fallback, { replace: true }))
}

// Registro de pantallas visitadas (lo llena App) para volver varias pantallas de una
export const visits = []
export function useBackTo() {
  const nav = useNavigate()
  return (path) => {
    const cur = window.history.state?.idx ?? 0
    const hit = [...visits].reverse().find((v) => v.path === path && v.idx < cur)
    return hit ? nav(hit.idx - cur) : nav(path, { replace: true })
  }
}

export function Back({ label, to, light }) {
  const back = useBack(to)
  return (
    <motion.button type="button" className="back" onClick={back} whileTap={TAP} style={light ? { color: '#fff' } : undefined} aria-label={`Volver a ${label}`}>
      <Icon name="back" size={22} />
      <span>{label}</span>
    </motion.button>
  )
}

export function TopBar({ back, to, right, light }) {
  return (
    <div className="topbar">
      {back ? <Back label={back} to={to} light={light} /> : <span />}
      {right}
    </div>
  )
}

export function Title({ children, sub, size = 'h1' }) {
  return (
    <div className="title-block">
      <h1 className={`display ${size}`}>{children}</h1>
      {sub && <p className="sub">{sub}</p>}
    </div>
  )
}

/* ---------- Botones y tarjetas tocables ---------- */
export function Btn({ to, kind = '', className = '', children, replace, ...p }) {
  const cls = `btn ${kind} ${className}`.trim()
  if (to) return <MLink to={to} replace={replace} className={cls} whileTap={TAP} {...p}>{children}</MLink>
  return <motion.button type="button" className={cls} whileTap={p.disabled ? undefined : TAP} {...p}>{children}</motion.button>
}

export function Tap({ to, className = '', children, replace, ...p }) {
  if (to) return <MLink to={to} replace={replace} className={className} whileTap={TAP} {...p}>{children}</MLink>
  return <motion.button type="button" className={className} whileTap={TAP} {...p}>{children}</motion.button>
}

export function Chip({ on, tone = 'ink', onClick, children, className = '', ...p }) {
  return (
    <motion.button type="button" className={`chip${on ? ` on ${tone}` : ''} ${className}`} aria-pressed={!!on} onClick={onClick} whileTap={{ scale: 0.95 }} {...p}>
      {children}
    </motion.button>
  )
}

export function Toggle({ on, onChange, label }) {
  return <button type="button" role="switch" aria-checked={!!on} aria-label={label} className="toggle" onClick={() => onChange(!on)} />
}

/* ---------- Control segmentado (la pastilla se desliza) ---------- */
export function Seg({ options, value, onChange, id, fit, label }) {
  return (
    <div className={`seg${fit ? ' fit' : ''}`} role="radiogroup" aria-label={label}>
      {options.map((o) => {
        const v = o.value ?? o
        const on = v === value
        return (
          <button key={v} type="button" role="radio" aria-checked={on} className={on ? 'on' : ''} onClick={() => onChange(v)}>
            {on && <motion.span layoutId={id} className="seg-pill" transition={{ type: 'spring', stiffness: 520, damping: 40 }} />}
            <span>{o.label ?? o}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Números con conteo animado ---------- */
export function Num({ value, max = 0, min = 0, from0 = false, format, className = 'num', duration = 0.7, style }) {
  const reduce = useReducedMotion()
  const f = format || ((v) => fmt(v, max, min))
  const ref = useRef(null)
  const shown = useRef(from0 ? 0 : value)
  const [first] = useState(() => f(from0 ? 0 : value))
  useEffect(() => {
    const el = ref.current
    const from = shown.current
    if (reduce || from === value) { shown.current = value; el.textContent = f(value); return }
    const c = animate(from, value, {
      duration, ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => { shown.current = v; el.textContent = f(v) },
      onComplete: () => { el.textContent = f(value) },
    })
    return () => c.stop()
  }) // se recalcula en cada render: si cambia el valor o el formato
  return <span ref={ref} className={className} style={style}>{first}</span>
}

/* ---------- Barras que crecen desde 0 ---------- */
export function Bar({ value, max = 100, color = 'var(--ink)', thick, band, delay = 0, label, track }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={`bar${thick ? ' thick' : ''}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} style={track ? { background: track } : undefined}>
      {band && <span className="band" style={{ left: `${band[0]}%`, width: `${band[1] - band[0]}%` }} />}
      <motion.span style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18, delay }} />
    </div>
  )
}

/* ---------- Stepper (− valor +) ---------- */
const round = (v, step) => +(Math.round(v / step) * step).toFixed(2)
export function Stepper({ value, onChange, step = 1, min = -Infinity, max = Infinity, format, sub, label }) {
  const change = (d) => onChange(Math.max(min, Math.min(max, round(value + d, step))))
  return (
    <div className="stepper">
      <motion.button type="button" className="round" aria-label={`Menos ${label}`} disabled={value <= min} onClick={() => change(-step)} whileTap={{ scale: 0.88 }}>
        <Icon name="minus" />
      </motion.button>
      <div className="val" aria-live="polite">
        <Num value={value} format={format} duration={0.35} />
        {sub && <p className="small muted mt4">{sub}</p>}
      </div>
      <motion.button type="button" className="round" aria-label={`Más ${label}`} disabled={value >= max} onClick={() => change(step)} whileTap={{ scale: 0.88 }}>
        <Icon name="plus" />
      </motion.button>
    </div>
  )
}

export function MiniStep({ value, onChange, step = 1, min = 0, max = 999, format = (v) => fmt(v, 1), label }) {
  const change = (d) => onChange(Math.max(min, Math.min(max, round(value + d, step))))
  return (
    <div className="mini-step">
      <motion.button type="button" aria-label={`Menos ${label}`} onClick={() => change(-step)} disabled={value <= min} whileTap={{ scale: 0.88 }}><Icon name="minus" size={18} /></motion.button>
      <span className="num" style={{ fontSize: 20, minWidth: 64, textAlign: 'center' }}>{format(value)}</span>
      <motion.button type="button" aria-label={`Más ${label}`} onClick={() => change(step)} disabled={value >= max} whileTap={{ scale: 0.88 }}><Icon name="plus" size={18} /></motion.button>
    </div>
  )
}

/* ---------- Checkbox animado ---------- */
export function Check({ on }) {
  return (
    <motion.span className={`check${on ? ' on' : ''}`} animate={{ scale: on ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M4 10.5 L8.5 15 L16 5.5" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.25 }} />
      </svg>
    </motion.span>
  )
}

/* ---------- Miniatura: foto o placeholder con el color del área ---------- */
export function Thumb({ src, alt = '', size = 52, radius = 15, forma = 'entreno', tone = 'training' }) {
  return (
    <div className={`thumb tint-${tone}`} style={{ width: size, height: size, borderRadius: radius, flex: 'none' }}>
      {src
        ? <img src={src} alt={alt} loading="lazy" width={size} height={size} />
        : <Character forma={forma} expr="contento" level={55} size={Math.round(size * 0.5)} breathe={false} />}
    </div>
  )
}

export function SectionHead({ title, children }) {
  return (
    <div className="section-head">
      <h2 className="display h2">{title}</h2>
      {children}
    </div>
  )
}

export function Row({ to, onClick, title, desc, left, right, chevron = true, state }) {
  const inner = (
    <>
      {left}
      <span className="grow stack g4"><span className="t">{title}</span>{desc && <span className="d">{desc}</span>}</span>
      {right}
      {chevron && <Icon name="chevron" size={18} style={{ color: 'var(--muted)' }} />}
    </>
  )
  if (!to && !onClick) return <div className="list-item" style={{ cursor: 'default' }}>{inner}</div>
  return <Tap to={to} onClick={onClick} state={state} className="list-item">{inner}</Tap>
}

/* ---------- Hoja inferior: sube con resorte, se cierra arrastrando ---------- */
export function Sheet({ open, onClose, title, children, label, aboveNav = false }) {
  const root = useContext(OverlayCtx)
  const controls = useDragControls()
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const t = setTimeout(() => ref.current?.focus({ preventScroll: true }), 60)
    const key = (e) => { if (e.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', key)
    return () => { clearTimeout(t); window.removeEventListener('keydown', key); prev?.focus?.({ preventScroll: true }) }
  }, [open])
  if (!root) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="scrim" className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            key="sheet" ref={ref} tabIndex={-1}
            className="sheet" role="dialog" aria-modal="true" aria-label={label || title}
            style={aboveNav ? { bottom: 'var(--nav-h)', maxHeight: 'calc(88% - var(--nav-h))' } : undefined}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            drag="y" dragListener={false} dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(e, i) => { if (i.offset.y > 80 || i.velocity.y > 450) onClose() }}
          >
            <div className="sheet-head" onPointerDown={(e) => controls.start(e)}>
              <div className="grabber" />
              {title && <h2 className="display h2">{title}</h2>}
            </div>
            <div className="sheet-body" style={aboveNav ? { paddingBottom: 16 } : undefined}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    root,
  )
}

/* ---------- Aviso de cuidado colapsable ---------- */
export function Collapse({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, marginTop: -16 }} transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
