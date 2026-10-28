import { useEffect, useRef, useState } from 'react'
import { animate, motion, motionValue, useReducedMotion } from 'framer-motion'
import { useStore } from '../../store'
import Character from '../../components/Character'
import { StatusBar } from '../../components/Shell'
import { Btn, Screen, Tap, Title, TopBar, useBack } from '../../components/ui'
import { DAYS, MONTHS, addMinutes, cap, hours, signed, weekday } from '../../lib/format'
import { direction } from './Progreso'

/* Silueta ilustrada (nunca cuerpos reales). `waist` va de 0 (más ancha) a 1 (más angosta). */
function Silhouette({ waist = 0 }) {
  const w = 30 - waist * 5
  return (
    <svg viewBox="0 0 120 220" width="56%" style={{ maxHeight: '82%' }} aria-hidden="true">
      <g fill="var(--ink)" opacity=".12">
        <circle cx="60" cy="28" r="18" />
        <path d={`M28 62 C40 54 80 54 92 62 C100 90 ${60 + w + 6} 104 ${60 + w} 122 C${60 + w + 8} 146 96 168 90 214 L30 214 C24 168 ${60 - w - 8} 146 ${60 - w} 122 C${60 - w - 6} 104 20 90 28 62 Z`} />
      </g>
    </svg>
  )
}

const PHOTOS = [
  { week: 1, tone: 'training', waist: 0 },
  { week: 4, tone: 'food', waist: 0.3 },
  { week: 8, tone: 'water', waist: 0.6 },
  { week: 12, tone: 'rest', waist: 1 },
]

export function Fotos() {
  const s = useStore()
  const extra = s.photos.map((p, i) => ({ week: `Hoy${i ? ` (${i + 1})` : ''}`, tone: 'primary', waist: 1 }))
  const add = () => { s.set((st) => ({ photos: [...st.photos, { at: Date.now() }] })); s.notify('Foto guardada solo en tu teléfono', 'agua') }
  return (
    <Screen action={<><Btn kind="sec" to="/progreso/comparar">Comparar semana 1 y 12</Btn><Btn onClick={add}>Sacar foto de hoy</Btn></>}>
      <TopBar back="Progreso" to="/progreso" />
      <Title>Fotos</Title>
      <div className="notice tint-primary" style={{ padding: '12px 16px' }}><p>Privadas: solo las ves vos. No se suben a ninguna red ni se usan para entrenar nada.</p></div>
      <div className="grid2">
        {[...PHOTOS, ...extra].map((p) => (
          <motion.div key={p.week} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
            <Tap to="/progreso/comparar" className={`ph-tile tint-${p.tone}`} aria-label={`Foto de la semana ${p.week}`}>
              <Silhouette waist={p.waist} tone={p.tone} />
              <span className="lbl">{typeof p.week === 'number' ? `Semana ${p.week}` : p.week}</span>
            </Tap>
          </motion.div>
        ))}
      </div>
    </Screen>
  )
}

/* Comparar con deslizador antes/después */
export function Comparar() {
  const s = useStore()
  const reduce = useReducedMotion()
  const box = useRef(null)
  const [pos, setPos] = useState(50)
  const drag = useRef(false)
  // un pequeño vaivén al entrar para mostrar que se puede deslizar
  useEffect(() => {
    if (reduce) return
    const mv = motionValue(50)
    const off = mv.on('change', setPos)
    const c = animate(mv, [50, 36, 62, 50], { duration: 1.4, delay: 0.4, ease: 'easeInOut' })
    return () => { c.stop(); off() }
  }, [reduce])
  const move = (e) => {
    if (!drag.current) return
    const r = box.current.getBoundingClientRect()
    setPos(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)))
  }
  const m = Object.fromEntries(s.measures.map((x) => [x.id, x.now - x.start]))
  const w = s.weights
  const dw = w.slice(-7).reduce((a, b) => a + b, 0) / 7 - w.slice(0, 7).reduce((a, b) => a + b, 0) / 7
  return (
    <Screen>
      <TopBar back="Fotos" to="/progreso/fotos" />
      <Title size="h2">Semana 1 y semana 12</Title>
      <div ref={box} className="compare"
        onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e) }}
        onPointerMove={move} onPointerUp={() => { drag.current = false }} onPointerCancel={() => { drag.current = false }}>
        <div className="layer tint-rest"><Silhouette waist={1} /></div>
        <div className="layer tint-training" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><Silhouette waist={0} /></div>
        <span className="lbl" style={{ left: 12 }}>Semana 1</span>
        <span className="lbl" style={{ right: 12 }}>Semana 12</span>
        <div className="handle" style={{ left: `${pos}%` }}>
          <span className="knob" role="slider" tabIndex={0} aria-label="Comparar fotos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
            onKeyDown={(e) => { if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 5)); if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 5)) }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5 L2 10 L7 15 M13 5 L18 10 L13 15" /></svg>
          </span>
        </div>
      </div>
      <div className="tiles">
        <div className="tile"><span className="num">{signed(m.cintura)} cm</span><span className="xs">Cintura</span></div>
        <div className="tile"><span className="num">{signed(m.cadera)} cm</span><span className="xs">Cadera</span></div>
        <div className="tile"><span className="num">{s.hideWeight ? direction(dw).toLowerCase() : Math.abs(dw) < 1 ? '=' : `${signed(+dw.toFixed(1))} kg`}</span><span className="xs">Peso</span></div>
      </div>
      <p className="small muted">Deslizá para comparar. Las fotos son privadas y solo están en tu teléfono.</p>
    </Screen>
  )
}

/* Tu mes: calendario sin rachas */
export function Mes() {
  const s = useStore()
  const now = new Date()
  const y = now.getFullYear(), mo = now.getMonth(), today = now.getDate()
  const first = weekday(new Date(y, mo, 1))
  const total = new Date(y, mo + 1, 0).getDate()
  const plan = s.routine.days
  const history = new Set(s.history.map((h) => { const d = new Date(h.date); return d.getMonth() === mo ? d.getDate() : -1 }))
  // días entrenados: los del historial y los días de la rutina (salteando alguno, porque pasa y está bien)
  const trained = (d) => d <= today && (history.has(d) || (plan.includes(weekday(new Date(y, mo, d))) && d % 6 !== 1 && d !== today) || (d === today && s.weekDone.includes(weekday())))
  const slept = (d) => d < today && (d % 7 === 0 || d === today - 1)
  const count = Array.from({ length: total }, (_, i) => i + 1).filter(trained).length
  const weeks = Math.max(1, today / 7)
  return (
    <Screen>
      <TopBar back="Progreso" to="/progreso" />
      <Title sub={`${count} entrenamientos · sin rachas: si faltás un día, no perdés nada.`}>{cap(MONTHS[mo])}</Title>
      <div className="card stack g12">
        <div className="cal" role="grid" aria-label={`Calendario de ${MONTHS[mo]}`}>
          {DAYS.map((d, i) => <span key={i} className="wd">{d}</span>)}
          {Array.from({ length: first }, (_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: total }, (_, i) => {
            const d = i + 1
            const t = trained(d)
            return (
              <motion.span key={d} className={`d${t ? ' trained' : ''}${d === today ? ' today' : ''}${d > today ? ' future' : ''}`}
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.012, type: 'spring', stiffness: 400, damping: 22 }}
                aria-label={`${d}${t ? ', entrenaste' : ''}${slept(d) ? ', dormiste poco' : ''}${d === today ? ', hoy' : ''}`}>
                {d}{slept(d) && <i className="sl" />}
              </motion.span>
            )
          })}
        </div>
        <div className="legend"><span><i style={{ background: 'var(--training)' }} />Entrenaste</span><span><i style={{ background: 'var(--rest)' }} />Dormiste poco</span></div>
      </div>
      <div className="tiles">
        <div className="tile" style={{ textAlign: 'left', padding: 12 }}><span className="num">{(count / weeks).toFixed(1).replace('.', ',')}</span><span className="xs">días por semana</span></div>
        <div className="tile" style={{ textAlign: 'left', padding: 12 }}><span className="num">82 %</span><span className="xs">días con proteína</span></div>
        <div className="tile" style={{ textAlign: 'left', padding: 12 }}><span className="num">7 h</span><span className="xs">sueño promedio</span></div>
      </div>
    </Screen>
  )
}

/* Revisión semanal (Pro, domingo) */
export function Revision() {
  const s = useStore()
  const back = useBack('/progreso')
  const dormir = s.reminders.find((r) => r.id === 'dormir')
  const apply = () => {
    s.set((st) => ({ weeklyApplied: true, reminders: st.reminders.map((r) => (r.id === 'dormir' ? { ...r, bed: addMinutes(r.bed, -30) } : r)) }))
    s.notify(`Listo: te avisamos para dormir a las ${addMinutes(dormir.bed, -30)}`, 'descanso')
    back()
  }
  const rows = [
    ['Entrenamientos', `${Math.max(s.sessions, 3)} de ${s.sessionsGoal}`],
    ['Días con proteína suficiente', '6 de 7'],
    ['Sueño promedio', hours(6 + 40 / 60)],
    ['Tendencia de peso', s.hideWeight ? 'bajando' : '−0,2 kg'],
  ]
  return (
    <Screen action={s.weeklyApplied
      ? <Btn kind="sec" onClick={back}>Volver</Btn>
      : <><Btn onClick={apply}>Aplicar propuesta</Btn><Btn kind="sec" onClick={() => { s.notify('Dejamos todo como está', 'descanso'); back() }}>Dejar todo como está</Btn></>}>
      <header className="bleed-top grad stack g12" style={{ paddingBottom: 18 }}>
        <StatusBar clear />
        <TopBar back="Progreso" to="/progreso" light />
        <span className="badge white" style={{ alignSelf: 'flex-start' }}>Pro · domingo</span>
        <h1 className="display h1">Tu semana</h1>
        <p className="t15" style={{ opacity: 0.92 }}>Vas a buen ritmo. Te contamos qué vimos y qué proponemos.</p>
        <div className="row g8" style={{ alignItems: 'flex-end' }}>
          {[['entreno', 62], ['comida', 60], ['agua', 52], ['descanso', 58]].map(([f, size], i) => (
            <motion.div key={f} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 300, damping: 16 }}>
              <Character forma={f} expr={f === 'descanso' ? 'cansado' : 'satisfecho'} level={80} size={size} />
            </motion.div>
          ))}
        </div>
      </header>
      <div className="card list">
        {rows.map(([k, v]) => <div key={k} className="list-item" style={{ cursor: 'default' }}><span className="grow t15">{k}</span><span className="num" style={{ fontSize: 18 }}>{v}</span></div>)}
      </div>
      <h2 className="display h2">Nuestra propuesta</h2>
      <div className="card soft tint-rest stack g4"><p className="t15 fw6">Mantener tus calorías</p><p className="small">Bajás 0,2 kg por semana sin perder fuerza: es un ritmo sano para tu objetivo.</p></div>
      <div className="card soft tint-hero stack g4"><p className="t15 fw6">Dormir 30 minutos más</p><p className="small">Es lo que más puede ayudarte a recuperarte esta semana. Movemos tu aviso de dormir a las {addMinutes(dormir.bed, -30)}.</p></div>
      {s.weeklyApplied && <p className="small muted tc">Ya aplicaste la propuesta de esta semana.</p>}
      {!s.pro && <p className="xs muted tc">Estás viendo una muestra de Pro. Todo lo demás sigue siendo gratis.</p>}
    </Screen>
  )
}
