import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useParams } from 'react-router-dom'
import { useStore } from '../../store'
import { EXERCISES, HIP_LOG, HIP_WEEKS } from '../../data'
import Icon from '../../components/Icons'
import { Btn, Screen, SectionHead, Sheet, Tap, Title, TopBar } from '../../components/ui'
import { DAY_SHORT, MONTHS, cap, daysAgo, fmt, shortDate, weekday } from '../../lib/format'

export function Historial() {
  const s = useStore()
  const [open, setOpen] = useState(null)
  const now = new Date()
  const thisMonth = s.history.filter((h) => new Date(h.date).getMonth() === now.getMonth())
  const avg = s.history.length ? Math.round(s.history.reduce((a, h) => a + h.minutes, 0) / s.history.length) : 0
  const groups = []
  s.history.forEach((h) => {
    const d = new Date(h.date); const k = `${d.getFullYear()}-${d.getMonth()}`
    const g = groups.find((x) => x.k === k) || (groups.push({ k, name: cap(MONTHS[d.getMonth()]), items: [] }), groups[groups.length - 1])
    g.items.push(h)
  })
  return (
    <Screen>
      <TopBar back="Entrenar" to="/entrenar" />
      <Title sub={`${thisMonth.length} este mes · ${avg} min en promedio`}>Tus entrenamientos</Title>
      <Tap to="/entrenar/progreso/hip" state={{ from: 'Historial' }} className="card soft tint-training row g12" style={{ padding: '14px 16px' }}>
        <span className="qa-ico" style={{ background: 'var(--surface)' }}><Icon name="trophy" /></span>
        <span className="stack g4 grow"><span className="fw6 t15">Más fuerte: hip thrust</span><span className="small">De 50 a 62,5 kg en 12 semanas</span></span>
        <Icon name="chevron" size={18} />
      </Tap>
      {groups.map((g) => (
        <section key={g.k} className="stack g10">
          <p className="small fw6 muted">{g.name}</p>
          {g.items.map((h) => {
            const d = new Date(h.date)
            return (
              <Tap key={h.id} className="card row g14" style={{ padding: 14 }} onClick={() => setOpen(h)}>
                <span className={`datebox tint-${h.tone}`}><span className="xs fw6">{DAY_SHORT[weekday(d)]}</span><span className="num" style={{ fontSize: 20, lineHeight: 1 }}>{d.getDate()}</span></span>
                <span className="stack g4 grow">
                  <span className="fw6 t15">{h.title}</span>
                  <span className="small muted">{h.minutes} min · {fmt(h.volume)} kg{h.record ? ` · ${h.record} récord` : ''}</span>
                </span>
                <Icon name="chevron" size={18} style={{ color: 'var(--muted)' }} />
              </Tap>
            )
          })}
        </section>
      ))}
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && <>
          <p className="t15 muted">{shortDate(new Date(open.date))}</p>
          <div className="tiles">
            <div className="tile"><span className="num">{open.minutes} min</span><span className="xs">Duración</span></div>
            <div className="tile"><span className="num">{fmt(open.volume)}</span><span className="xs">kg de volumen</span></div>
            <div className="tile"><span className="num">{open.record || 0}</span><span className="xs">Récord</span></div>
          </div>
          <p className="small muted">El volumen es la suma de kilos × repeticiones de todas tus series.</p>
          <Btn onClick={() => setOpen(null)}>Cerrar</Btn>
        </>}
      </Sheet>
    </Screen>
  )
}

export function ProgresoEjercicio() {
  const { id } = useParams()
  const loc = useLocation()
  const ex = EXERCISES[id] || EXERCISES.hip
  const isHip = ex.id === 'hip'
  // para los demás ejercicios armamos una progresión suave a partir de su peso de referencia
  const weeks = isHip ? HIP_WEEKS : Array.from({ length: 12 }, (_, i) => Math.max(1, Math.round((ex.kg || 10) * (0.8 + i * 0.02) * 2) / 2))
  const max = Math.max(...weeks)
  const gain = weeks[weeks.length - 1] - weeks[0]
  const labels = [daysAgo(77), daysAgo(42), daysAgo(0)].map((d) => cap(MONTHS[d.getMonth()].slice(0, 3)))
  const log = isHip ? HIP_LOG : [{ d: 0, sets: `${fmt(max, 1)} kg × 10 · ${fmt(max, 1)} × 10 · ${fmt(max, 1)} × 9` }]
  return (
    <Screen>
      <TopBar back={loc.state?.from || 'Progreso'} to="/progreso" />
      <Title>{ex.name}</Title>
      <div className="grid2">
        <div className="card soft tint-training stack g4"><span className="num h2">{fmt(max, 1)} kg × 8</span><span className="small">Mejor serie</span></div>
        <div className="card soft tint-rest stack g4"><span className="num h2">+{fmt(gain, 1)} kg</span><span className="small">En 12 semanas</span></div>
      </div>
      <div className="card stack g12">
        <p className="small fw6 muted">Peso de tu mejor serie por semana</p>
        <div className="wbars" role="img" aria-label={`De ${fmt(weeks[0], 1)} a ${fmt(max, 1)} kg en 12 semanas`}>
          {weeks.map((w, i) => (
            <motion.span key={i} style={{ background: i === weeks.length - 1 ? 'var(--training)' : 'var(--training-soft)' }}
              initial={{ height: 0 }} animate={{ height: `${((w - weeks[0] * 0.7) / (max - weeks[0] * 0.7)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.1 + i * 0.04 }} />
          ))}
        </div>
        <div className="row between xs muted">{labels.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
      <SectionHead title="Historial" />
      <div className="card list">
        {log.map((h) => (
          <div key={h.d} className="list-item" style={{ cursor: 'default' }}>
            <span className="stack g4"><span className="t">{shortDate(daysAgo(h.d))}</span><span className="d">{h.sets}</span></span>
          </div>
        ))}
      </div>
    </Screen>
  )
}
