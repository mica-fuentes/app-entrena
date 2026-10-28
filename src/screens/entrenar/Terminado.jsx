import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import Character from '../../components/Character'
import { StatusBar } from '../../components/Shell'
import { Btn, Chip, Num, Screen } from '../../components/ui'
import { fmt } from '../../lib/format'

/* Festejo con las formas de la marca (círculos, gotas y lunas), sin confeti genérico */
const COLORS = ['#B8E62E', '#FF6FAE', '#22BFE0', '#FFFFFF', '#DCE4FF']
const SHAPES = {
  circle: <circle cx="10" cy="10" r="8" />,
  drop: <path d="M10 1 C12 1 18 9 18 13 C18 17 14.5 19.5 10 19.5 C5.5 19.5 2 17 2 13 C2 9 8 1 10 1 Z" />,
  moon: <path d="M15 13 C13.8 16 11 18 8 18 C4.1 18 1 14.9 1 11 C1 7.8 3 5.1 5.8 4 C5.3 9 9 13 15 13 Z" />,
}
function Celebration() {
  const reduce = useReducedMotion()
  const bits = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.2
    const r = 120 + ((i * 37) % 90)
    return { k: i, shape: Object.keys(SHAPES)[i % 3], color: COLORS[i % COLORS.length], x: Math.cos(a) * r, y: Math.sin(a) * r * 0.75 - 30, rot: ((i * 53) % 360) - 180, size: 10 + ((i * 7) % 12), delay: 0.25 + (i % 6) * 0.03 }
  }), [])
  if (reduce) return null
  return (
    <div className="celebrate" aria-hidden="true">
      {bits.map((b) => (
        <motion.svg key={b.k} viewBox="0 0 20 20" width={b.size} height={b.size} fill={b.color} style={{ position: 'absolute', left: '50%', top: 130 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 160], scale: [0, 1.2, 1], opacity: [1, 1, 0], rotate: b.rot }}
          transition={{ duration: 1.9, delay: b.delay, ease: [0.15, 0.7, 0.3, 1], times: [0, 0.45, 1] }}>
          {SHAPES[b.shape]}
        </motion.svg>
      ))}
    </div>
  )
}

export default function Terminado() {
  const s = useStore()
  const navigate = useNavigate()
  const [feel, setFeel] = useState(null)
  const L = s.lastSession
  if (!L) return <Navigate to="/entrenar" replace />
  const missing = Math.max(0, s.protGoal - s.prot)
  const choose = (f) => { setFeel(f); s.notify(f === 'Muy exigente' ? 'Gracias. La próxima vamos un poco más suave.' : 'Gracias. Lo tenemos en cuenta para la próxima.', 'entreno') }
  return (
    <Screen nav={false} action={<Btn onClick={() => navigate('/hoy', { replace: true })}>Listo</Btn>} label="Listo por hoy">
      <header className="bleed-top grad center-stack" style={{ paddingBottom: 30 }}>
        <StatusBar clear />
        <Celebration />
        <motion.div initial={{ y: -120, scale: 0.4, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }} style={{ marginTop: 18 }}>
          <Character forma="entreno" expr="satisfecho" level={100} size={112} label="Pesa rusa feliz" />
        </motion.div>
        <h1 className="display h1" style={{ fontSize: 'clamp(30px, 9cqi, 36px)' }}>¡Listo por hoy!</h1>
        <p className="t15" style={{ opacity: 0.92 }}>{L.title} · {L.minutes} min</p>
      </header>

      <div className="tiles">
        <div className="tile"><Num value={L.volume} from0 duration={1.2} format={(v) => `${fmt(v)} kg`} /><span className="xs">Volumen</span></div>
        <div className="tile"><Num value={L.sets} from0 duration={1} /><span className="xs">Series</span></div>
        <div className="tile"><Num value={L.records} from0 duration={0.8} /><span className="xs">Récord</span></div>
      </div>

      {L.record && (
        <motion.div className="card soft tint-training stack g4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.6, stiffness: 300, damping: 18 }}>
          <p className="small fw6">Nuevo récord</p>
          <p className="display h2">{L.record.name}: {fmt(L.record.kg, 1)} kg × {L.record.reps}</p>
        </motion.div>
      )}

      <div className="card stack g12">
        <p className="display h3">¿Cómo te sentiste?</p>
        <div className="chips">{['Fácil', 'Justo', 'Muy exigente'].map((f) => <Chip key={f} on={feel === f} tone="rest" onClick={() => choose(f)}>{f}</Chip>)}</div>
        <p className="xs muted">Lo usamos para ajustar la próxima sesión.</p>
      </div>

      {missing > 0 && (
        <Link to="/comida/buscar" className="card soft tint-food stack g4" style={{ textDecoration: 'none' }}>
          <p className="t15 fw6">Te faltan {missing} g de proteína hoy</p>
          <p className="small">Una buena cena alcanza: huevos, atún o pollo.</p>
        </Link>
      )}
    </Screen>
  )
}
