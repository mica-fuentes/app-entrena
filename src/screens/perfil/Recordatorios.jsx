import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Chip, Screen, Sheet, Tap, Title, Toggle, TopBar } from '../../components/ui'
import { DAYS, DAY_NAMES, daysLabel, hours } from '../../lib/format'

const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const sleepH = (bed, wake) => (((toMin(wake) - toMin(bed)) + 1440) % 1440) / 60
const pad = (t) => (t.length === 4 ? `0${t}` : t) // para <input type="time">
const unpad = (t) => t.replace(/^0(\d)/, '$1')

export function detail(r) {
  if (r.kind === 'agua') return `Cada ${r.every}, de ${r.from} a ${r.to}`
  if (r.kind === 'entreno') return `${daysLabel(r.days)} a las ${r.time}`
  if (r.kind === 'comidas') return `Si no cargaste nada a las ${r.time}`
  if (r.kind === 'peso') { const n = DAY_NAMES[r.day].replace(/^./, (c) => c.toUpperCase()); return `${n.endsWith('s') ? n : `${n}s`} a las ${r.time} · en ayunas` }
  if (r.kind === 'dormir') return `${r.bed} · ${hours(sleepH(r.bed, r.wake))} antes de tu alarma`
  return `Todos los días a las ${r.time}`
}

function TimeBox({ label, value, onChange, small, note }) {
  return (
    <label className={`card stack ${small ? 'g4' : 'g4 center-stack'}`} style={{ padding: small ? '12px 16px' : 16 }}>
      {label && <span className="small muted">{label}</span>}
      <input type="time" className={`time-in${small ? ' time-sm' : ''}`} value={pad(value)} onChange={(e) => e.target.value && onChange(unpad(e.target.value))} aria-label={label || 'Hora'} />
      {note && <span className="small muted">{note}</span>}
    </label>
  )
}

function Editor({ r, onChange, onSave }) {
  const set = (patch) => onChange({ ...r, ...patch })
  const before = (tone) => (
    <div className="stack g8"><p className="group-label" style={{ margin: 0 }}>Avisarme</p>
      <div className="chips">{['15 min antes', '30 min antes', '1 h antes'].map((x) => <Chip key={x} on={r.before === x} tone={tone} onClick={() => set({ before: x })}>{x}</Chip>)}</div></div>
  )
  let body
  if (r.kind === 'entreno') {
    body = <>
      <p className="group-label" style={{ margin: 0 }}>¿Qué días?</p>
      <div className="week">{DAYS.map((d, i) => <motion.button key={i} type="button" whileTap={{ scale: 0.9 }} className={`daydot${r.days.includes(i) ? ' on soft' : ''}`} aria-pressed={r.days.includes(i)} aria-label={DAY_NAMES[i]} onClick={() => set({ days: r.days.includes(i) ? r.days.filter((x) => x !== i) : [...r.days, i].sort() })}>{d}</motion.button>)}</div>
      <TimeBox label="¿A qué hora entrenás?" value={r.time} onChange={(time) => set({ time })} note="Tocá para cambiar" />
      {before('training')}
      <div className="notice tint-primary" style={{ alignItems: 'center' }}><Character forma="entreno" expr="energia" level={60} size={34} /><p>"Día de piernas a las {r.time}. ¿Arrancamos?"</p></div>
    </>
  } else if (r.kind === 'agua') {
    body = <>
      <p className="group-label" style={{ margin: 0 }}>Cada cuánto</p>
      <div className="chips">{['40 min', '1 h', '2 h', '3 h'].map((x) => <Chip key={x} on={r.every === x} tone="water" onClick={() => set({ every: x })}>{x}</Chip>)}</div>
      <p className="group-label" style={{ margin: 0 }}>Entre</p>
      <div className="grid2"><TimeBox small label="Desde" value={r.from} onChange={(from) => set({ from })} /><TimeBox small label="Hasta" value={r.to} onChange={(to) => set({ to })} /></div>
      <div className="notice tint-water" style={{ alignItems: 'center' }}><Character forma="agua" expr="contento" level={60} size={34} /><p>Si ya llegaste a tu meta del día, dejamos de avisarte.</p></div>
    </>
  } else if (r.kind === 'peso') {
    body = <>
      <p className="small muted">Una vez por semana alcanza para ver la tendencia.</p>
      <p className="group-label" style={{ margin: 0 }}>¿Qué día?</p>
      <div className="week">{DAYS.map((d, i) => <motion.button key={i} type="button" whileTap={{ scale: 0.9 }} className={`daydot${r.day === i ? ' on lime' : ''}`} aria-pressed={r.day === i} aria-label={DAY_NAMES[i]} onClick={() => set({ day: i })}>{d}</motion.button>)}</div>
      <TimeBox label="Hora" value={r.time} onChange={(time) => set({ time })} note="Siempre a la mañana" />
      <div className="notice tint-hero"><div className="stack g4"><p className="t">Siempre en ayunas</p><p>Al levantarte, después de ir al baño y antes de comer o tomar algo. Si no, el número cambia y no se puede comparar.</p></div></div>
    </>
  } else if (r.kind === 'dormir') {
    const h = sleepH(r.bed, r.wake)
    const okH = h >= 7 && h <= 9
    body = <>
      <div className="grid2"><TimeBox small label="Me quiero acostar" value={r.bed} onChange={(bed) => set({ bed })} /><TimeBox small label="Me levanto" value={r.wake} onChange={(wake) => set({ wake })} /></div>
      <div className={`notice ${okH ? 'tint-rest' : 'tint-hero'}`} style={{ alignItems: 'center' }}>
        <Character forma="descanso" expr={okH ? 'satisfecho' : 'dormido'} level={(h / 9) * 100} size={42} />
        <div className="stack g4"><p className="t">{hours(h)} de sueño</p><p>{okH ? 'Para entrenar y recuperarte, lo ideal es entre 7 y 9 h.' : 'Queda fuera de lo ideal para recuperarte: entre 7 y 9 h.'}</p></div>
      </div>
      {before('rest')}
    </>
  } else {
    body = <>
      {r.kind === 'custom' && <label className="field"><span className="lbl">Nombre</span><input value={r.title} onChange={(e) => set({ title: e.target.value })} /></label>}
      <TimeBox label="Hora" value={r.time} onChange={(time) => set({ time })} />
      {r.kind === 'comidas' && <p className="small muted">Solo te avisamos si a esa hora todavía no cargaste nada. Sin reproches.</p>}
    </>
  }
  return <>{body}<Btn onClick={onSave}>Guardar</Btn></>
}

const NEW = [
  { kind: 'custom', title: 'Estirar', time: '19:00' },
  { kind: 'custom', title: 'Tomar creatina', time: '9:00' },
  { kind: 'custom', title: 'Preparar la vianda', time: '21:30' },
  { kind: 'custom', title: 'Mi recordatorio', time: '10:00' },
]

export function Recordatorios() {
  const s = useStore()
  const [edit, setEdit] = useState(null)
  const [pick, setPick] = useState(false)
  const toggle = (id, on) => s.set((st) => ({ reminders: st.reminders.map((r) => (r.id === id ? { ...r, on } : r)) }))
  const save = () => {
    s.set((st) => ({ reminders: st.reminders.some((r) => r.id === edit.id) ? st.reminders.map((r) => (r.id === edit.id ? edit : r)) : [...st.reminders, edit] }))
    setEdit(null); s.notify('Recordatorio guardado', 'agua')
  }
  return (
    <Screen>
      <TopBar back="Perfil" to="/perfil" />
      <Title sub="Pocos y útiles. Nunca te mandamos mensajes de culpa.">Recordatorios</Title>
      <div className="card list">
        <AnimatePresence initial={false}>
          {s.reminders.map((r) => (
            <motion.div key={r.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="list-item" style={{ cursor: 'default' }}>
              <span className="grow stack g4" style={{ opacity: r.on ? 1 : 0.6 }}><span className="t">{r.title}</span><span className="d">{detail(r)}</span></span>
              <button type="button" className="hit" aria-label={`Editar ${r.title}`} onClick={() => setEdit(r)} style={{ color: 'var(--muted)' }}><Icon name="edit" size={19} stroke={1.5} /></button>
              <Toggle on={r.on} onChange={(on) => toggle(r.id, on)} label={`${r.title}: ${r.on ? 'activado' : 'apagado'}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Btn kind="dashed" onClick={() => setPick(true)}>+ Nuevo recordatorio</Btn>
      <div className="card soft tint-primary stack g10">
        <p className="xs fw6 muted">Así se ven</p>
        <div className="notif" style={{ background: 'var(--surface)', color: 'var(--ink)' }}>
          <Character forma="agua" expr="contento" level={60} size={34} breathe={false} />
          <div className="stack g4"><p className="fw6 t15">Un vaso de agua y seguís</p><p className="small">Te faltan {((s.waterGoal - s.water) / 1000).toFixed(1).replace('.', ',')} L para tu meta de hoy.</p></div>
        </div>
      </div>

      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit?.title}>
        {edit && <Editor r={edit} onChange={setEdit} onSave={save} />}
      </Sheet>
      <Sheet open={pick} onClose={() => setPick(false)} title="Nuevo recordatorio">
        {NEW.map((n) => (
          <Tap key={n.title} className="opt" onClick={() => { setPick(false); setTimeout(() => setEdit({ ...n, id: `r${Date.now()}`, on: true }), 260) }}>
            <span className="grow t">{n.title}</span><Icon name="plus" size={20} />
          </Tap>
        ))}
      </Sheet>
    </Screen>
  )
}
