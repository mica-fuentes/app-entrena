import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store'
import { WEIGHTS_YEAR } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Num, Row, Screen, Seg, Stepper, Tap, Title, Toggle, TopBar, useBack } from '../../components/ui'
import { kg, signed } from '../../lib/format'

// Tendencia = promedio de los últimos 7 pesajes
const trendOf = (arr) => arr.map((_, i) => { const w = arr.slice(Math.max(0, i - 6), i + 1); return w.reduce((a, b) => a + b, 0) / w.length })
export const direction = (delta) => (delta < -0.3 ? 'Bajando' : delta > 0.3 ? 'Subiendo' : 'Estable')

const PERIODS = { Mes: { n: 12, span: 'en 4 semanas' }, '3 meses': { n: 42, span: 'en 12 semanas' }, Año: { n: Infinity, span: 'en 12 meses' } }

function WeightChart({ data, hide }) {
  const W = 300, H = 120, P = 6
  const tr = trendOf(data)
  const all = [...data, ...tr]
  const lo = Math.min(...all) - 0.2, hi = Math.max(...all) + 0.2
  const x = (i) => P + (i / (data.length - 1)) * (W - P * 2)
  const y = (v) => P + (1 - (v - lo) / (hi - lo)) * (H - P * 2)
  const d = tr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const r = data.length > 60 ? 1.6 : 2.6
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={hide ? 'Gráfico de la tendencia de peso, sin números' : `Tendencia de peso: de ${kg(tr[0])} a ${kg(tr[tr.length - 1])} kg`}>
      {data.map((v, i) => <motion.circle key={i} cx={x(i)} cy={y(v)} r={r} fill="var(--muted)" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.2 + i * (0.6 / data.length) }} />)}
      <motion.path d={d} fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.15 }} />
      <motion.circle cx={x(tr.length - 1)} cy={y(tr[tr.length - 1])} r="5" fill="var(--rest)" stroke="var(--ink)" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.35, type: 'spring', stiffness: 400, damping: 14 }} />
    </svg>
  )
}

export function Inicio() {
  const s = useStore()
  const [period, setPeriod] = useState('3 meses')
  const src = period === 'Año' ? [...WEIGHTS_YEAR.slice(0, -42), ...s.weights] : s.weights
  const data = src.slice(-Math.min(PERIODS[period].n, src.length))
  const tr = trendOf(data)
  const delta = tr[tr.length - 1] - tr[0]
  const meas = Object.fromEntries(s.measures.map((m) => [m.id, m.now - m.start]))
  const flat = Math.abs(delta) < 1.5
  return (
    <Screen>
      <Title>Progreso</Title>
      <Seg id="periodo" fit options={['Mes', '3 meses', 'Año']} value={period} onChange={setPeriod} label="Período" />

      <section className="card stack g12" aria-label="Peso">
        <div className="row between g8">
          <p className="label">Peso · tendencia</p>
          <Tap to="/progreso/peso" className="link" style={{ minHeight: 40 }}>+ Registrar</Tap>
        </div>
        {s.hideWeight
          ? <p className="row g8 wrap" style={{ alignItems: 'baseline' }}><span className="num" style={{ fontSize: 34 }}>{direction(delta)}</span><span className="small muted">{PERIODS[period].span}</span></p>
          : <p className="row g8 wrap" style={{ alignItems: 'baseline' }}><Num value={tr[tr.length - 1]} max={1} min={1} format={(v) => `${kg(v)} kg`} style={{ fontSize: 34 }} /><span className="small muted">{signed(+delta.toFixed(1))} kg {PERIODS[period].span}</span></p>}
        <AnimatePresence mode="wait">
          <motion.div key={period} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><WeightChart data={data} hide={s.hideWeight} /></motion.div>
        </AnimatePresence>
        <p className="small muted">Los puntos son tus pesajes; la línea es lo que importa. Las subidas de un día suelen ser agua (creatina, sal, ciclo), no grasa.</p>
      </section>

      <div className="grid2">
        <Tap to="/progreso/medidas" className="card soft tint-water stack g4">
          <span className="small">Cintura</span><span className="num h2">{signed(meas.cintura)} cm</span><span className="xs">desde el inicio</span>
        </Tap>
        <Tap to="/progreso/medidas" className="card soft tint-food stack g4">
          <span className="small">Cadera</span><span className="num h2">{signed(meas.cadera)} cm</span><span className="xs">desde el inicio</span>
        </Tap>
      </div>

      {flat && (
        <div className="notice tint-hero">
          <Character forma="comida" expr="satisfecho" level={70} size={48} />
          <div className="stack g4">
            <p className="t">Tu peso casi no cambió, y está bien</p>
            <p>Con {signed(meas.cintura)} cm de cintura y casi el mismo peso, bajaste grasa y ganaste músculo. En tu objetivo, las medidas dicen más que la balanza.</p>
          </div>
        </div>
      )}

      <Tap to="/entrenar/progreso/hip" state={{ from: 'Progreso' }} className="card soft tint-training row g12" style={{ padding: 20 }}>
        <span className="stack g6 grow">
          <span className="label">Más fuerte</span>
          <span className="display h2">Hip thrust: de 50 a 62,5 kg</span>
          <span className="small">+25 % en 12 semanas, sin cambiar tu peso.</span>
        </span>
        <Character forma="entreno" expr="satisfecho" level={80} size={60} />
      </Tap>

      <div className="card list">
        <Row to="/progreso/fotos" left={<span className="qa-ico tint-primary"><Icon name="photo" /></span>} title="Fotos" desc="Privadas, solo en tu teléfono" />
        <Row to="/progreso/medidas" left={<span className="qa-ico tint-water"><Icon name="ruler" /></span>} title="Medidas" desc="Cintura, cadera, muslo y brazo" />
        <Row to="/progreso/mes" left={<span className="qa-ico tint-training"><Icon name="calendar" /></span>} title="Tu mes" desc="Sin rachas: si faltás un día, no perdés nada" />
        <Row to="/progreso/revision" left={<span className="qa-ico tint-rest"><Icon name="sparkle" /></span>} title={<>Revisión semanal <span className="badge" style={{ marginLeft: 6 }}>Pro</span></>} desc="Cada domingo, con una propuesta" />
      </div>
    </Screen>
  )
}

/* Registrar peso */
export function Peso() {
  const s = useStore()
  const back = useBack('/progreso')
  const last = s.weights[s.weights.length - 1]
  const [v, setV] = useState(s.body.weight || last)
  const now = new Date()
  const tr = trendOf(s.weights)
  const save = () => { s.logWeight(v); back() }
  return (
    <Screen nav={false} action={<Btn onClick={save}>Guardar</Btn>}>
      <TopBar back="Progreso" to="/progreso" />
      <Title>¿Cuánto pesás hoy?</Title>
      <span className="chip static" style={{ alignSelf: 'flex-start', background: 'var(--primary-soft)', borderColor: 'transparent', fontWeight: 600 }}>Hoy, {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}</span>
      <Stepper value={v} onChange={setV} step={0.1} min={30} max={250} format={(x) => `${kg(x)} kg`} label="100 gramos"
        sub={s.hideWeight ? `Tendencia: ${direction(tr[tr.length - 1] - tr[0]).toLowerCase()}` : `Tendencia: ${kg(tr[tr.length - 1])} kg`} />
      <div className="notice tint-rest">
        <div className="stack g4">
          <p className="t">Para que sea comparable</p>
          <p>Pesate siempre a la mañana, en ayunas y después de ir al baño. Las subidas de un día suelen ser agua. Si entrenás para ganar músculo, puede que el peso no baje aunque estés perdiendo grasa.</p>
        </div>
      </div>
      <div className="card row between g12">
        <div className="stack g4"><p className="t15 fw6">Ocultar el número</p><p className="small muted">Ver solo si la tendencia sube, baja o se mantiene.</p></div>
        <Toggle on={s.hideWeight} onChange={(x) => s.set({ hideWeight: x })} label="Ocultar el número" />
      </div>
    </Screen>
  )
}

/* Medidas */
export function Medidas() {
  const s = useStore()
  const [vals, setVals] = useState(() => Object.fromEntries(s.measures.map((m) => [m.id, String(m.now).replace('.', ',')])))
  const num = (t) => parseFloat(String(t).replace(',', '.'))
  const save = () => {
    s.set((st) => ({ measures: st.measures.map((m) => ({ ...m, now: num(vals[m.id]) || m.now })) }))
    s.notify('Medidas guardadas', 'comida')
  }
  const diff = (m) => { const d = +((num(vals[m.id]) || m.now) - m.start).toFixed(1); return d === 0 ? 'igual que al inicio' : `${signed(d)} cm desde el inicio` }
  const waist = (num(vals.cintura) || 0) - s.measures[0].start, hip = (num(vals.cadera) || 0) - s.measures[1].start
  return (
    <Screen action={<Btn onClick={save}>Guardar medidas</Btn>}>
      <TopBar back="Progreso" to="/progreso" />
      <Title sub="Con cinta métrica, sobre la piel. Cada 2 a 4 semanas alcanza.">Tus medidas</Title>
      <div className="card list">
        {s.measures.map((m) => (
          <label key={m.id} className="list-item" style={{ cursor: 'text' }}>
            <span className="grow stack g4"><span className="t">{m.name}</span><span className="d">{diff(m)}</span></span>
            <span className="measure-in"><input inputMode="decimal" value={vals[m.id]} onChange={(e) => setVals((x) => ({ ...x, [m.id]: e.target.value.replace(/[^\d,.]/g, '').slice(0, 5) }))} aria-label={`${m.name} en centímetros`} /><span>cm</span></span>
          </label>
        ))}
      </div>
      <div className="notice tint-food" style={{ alignItems: 'center' }}>
        <Character forma="comida" expr="satisfecho" level={70} size={46} />
        <p>{waist < 0 && hip > 0 ? 'Menos cintura y más cadera: estás ganando músculo donde querías.' : waist < 0 ? 'Menos cintura: vas por buen camino.' : 'Las medidas cambian despacio. Lo importante es la tendencia.'}</p>
      </div>
    </Screen>
  )
}
