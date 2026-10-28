import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Icon from './Icons'
import Character from './Character'

export const TABS = [
  { id: 'hoy', to: '/hoy', label: 'Hoy', icon: 'hoy', color: 'var(--ink)' },
  { id: 'entrenar', to: '/entrenar', label: 'Entrenar', icon: 'entrenar', color: 'var(--training)' },
  { id: 'comida', to: '/comida', label: 'Comida', icon: 'comida', color: 'var(--food)' },
  { id: 'progreso', to: '/progreso', label: 'Progreso', icon: 'progreso', color: 'var(--rest)' },
]

/* Barra inferior: Hoy · Entrenar · [+] · Comida · Progreso */
export function Nav({ tab, visible }) {
  const { sheet, setSheet } = useStore()
  const open = sheet === 'add'
  const item = (t) => {
    const on = t.id === tab
    return (
      <Link key={t.id} to={t.to} className={on ? 'active' : ''} aria-current={on ? 'page' : undefined} onClick={() => setSheet(null)}>
        <Icon name={t.icon} size={23} />
        <span>{t.label}</span>
        {on && <motion.span layoutId="nav-dot" className="dot" style={{ background: t.color }} transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
      </Link>
    )
  }
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.nav
          key="nav" className="nav" aria-label="Navegación principal"
          style={{ zIndex: open ? 45 : 20 }}
          initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        >
          {TABS.slice(0, 2).map(item)}
          <motion.button
            type="button" className="add"
            aria-label={open ? 'Cerrar registro rápido' : 'Registrar algo'} aria-expanded={open}
            onClick={() => setSheet(open ? null : 'add')}
            whileTap={{ scale: 0.9 }} animate={{ rotate: open ? 45 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Icon name="plus" size={24} stroke={2.2} />
          </motion.button>
          {TABS.slice(2).map(item)}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

/* Toast arriba, con el personaje que corresponde; se va solo a los 2,4 s */
export function Toast() {
  const { toast } = useStore()
  return (
    <div aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.k} className="toast"
            initial={{ y: -90, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -60, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Character forma={toast.char} expr={toast.char === 'descanso' ? 'satisfecho' : 'energia'} level={80} size={30} breathe={false} />
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Barra de estado del marco de teléfono (solo en compu) */
export function StatusBar({ clear }) {
  return (
    <div className={`statusbar${clear ? ' clear' : ''}`} aria-hidden="true">
      <div>9:41</div>
      <div>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2 C5 1 11 1 14.5 4.2 M4 7 C6.3 5 9.7 5 12 7" /><circle cx="8" cy="10" r="1.3" fill="currentColor" stroke="none" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="currentColor" opacity=".45" /><rect x="2.5" y="2.5" width="18" height="7" rx="2" fill="currentColor" /><rect x="24" y="4" width="1.8" height="4" rx="0.9" fill="currentColor" opacity=".5" /></svg>
      </div>
    </div>
  )
}

/* Sin conexión: aviso amable, nunca bloquea */
export function OfflineBanner({ hidden }) {
  const [off, setOff] = useState(typeof navigator !== 'undefined' && navigator.onLine === false)
  useEffect(() => {
    const on = () => setOff(false), offF = () => setOff(true)
    window.addEventListener('online', on); window.addEventListener('offline', offF)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', offF) }
  }, [])
  return (
    <AnimatePresence>
      {off && !hidden && (
        <motion.div className="offline" role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
          <Character forma="agua" expr="contento" level={40} size={28} breathe={false} />
          <span><b>Sin conexión.</b> Podés seguir: guardamos todo y sincronizamos después.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
