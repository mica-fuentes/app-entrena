import { AnimatePresence, motion } from 'framer-motion'
import Character from './Character'
import { Chip, MiniStep } from './ui'
import { fmt, kg } from '../lib/format'
import { rangeKg, span } from '../lib/goal'

export const GOALS = [
  { t: 'Ganar músculo', d: 'Hipertrofia, con foco en las zonas que elijas' },
  { t: 'Tonificar', d: 'Mantener o ganar músculo y bajar grasa' },
  { t: 'Bajar grasa', d: 'Cuidando el músculo que ya tenés' },
  { t: 'Todo a la vez', d: 'Recomposición: más músculo y menos grasa, a un ritmo realista' },
  { t: 'Mantener', d: 'Moverme, tener energía, sostener mi estado' },
]

/* Meta: peso y plazo */
export function GoalFields({ weight, target, weeks, onTarget, onWeeks }) {
  const diff = target - weight
  return (
    <div className="card list">
      <div className="list-item goal-row" style={{ cursor: 'default' }}>
        <span className="grow stack g4"><span className="t">Meta de peso</span><span className="d">{Math.abs(diff) < 0.5 ? 'Mantener tu peso' : `${diff < 0 ? 'Bajar' : 'Subir'} ${kg(Math.abs(diff))} kg`}</span></span>
        <MiniStep value={target} onChange={onTarget} step={0.5} min={35} max={200} format={(v) => `${kg(v)} kg`} label="medio kilo" />
      </div>
      <div className="list-item goal-row" style={{ cursor: 'default' }}>
        <span className="grow stack g4"><span className="t">Para cuándo</span><span className="d">En {span(weeks)}</span></span>
        <MiniStep value={weeks} onChange={onWeeks} step={1} min={1} max={104} format={(v) => `${v} sem.`} label="una semana" />
      </div>
    </div>
  )
}

/* Resultado del chequeo de realismo, en vivo */
export function RealismResult({ res, weight }) {
  let key, body
  if (res.kind === 'keep') {
    key = 'keep'
    body = (
      <div className="notice tint-rest">
        <Character forma="descanso" expr="satisfecho" level={80} size={44} />
        <div className="stack g4"><p className="t">Mantener tu peso, y está bien</p><p>En recomposición el peso puede no bajar: importan la cintura, las medidas y la fuerza.</p></div>
      </div>
    )
  } else if (res.low) {
    key = 'low'
    body = (
      <div className="notice tint-warn">
        <Character forma="descanso" expr="cansado" level={40} size={48} />
        <div className="stack g6">
          <p className="display h3 warn-title">Esa meta queda por debajo de un peso saludable</p>
          <p>Para tu altura, lo saludable empieza cerca de {res.minHealthy} kg. Elegí otra meta; si querés, charlalo con un profesional de la salud.</p>
        </div>
      </div>
    )
  } else if (res.ok) {
    key = 'ok'
    body = (
      <div className="notice tint-rest">
        <Character forma="descanso" expr="satisfecho" level={85} size={48} />
        <div className="stack g4">
          <p className="t">Es una meta realista</p>
          <p>Son {kg(res.amount)} kg en {span(res.weeks)}: unos {fmt(res.rate, 1)} kg por semana. Está dentro de lo seguro para tu cuerpo.</p>
        </div>
      </div>
    )
  } else {
    key = 'unsafe'
    const verb = res.kind === 'lose' ? 'bajar grasa sin perder músculo ni energía' : 'ganar músculo sin sumar grasa de más'
    body = (
      <div className="card soft tint-warn stack g12" style={{ padding: 16 }}>
        <div className="row g12" style={{ alignItems: 'flex-start' }}>
          <Character forma="descanso" expr="cansado" level={40} size={50} label="Luna cansada" />
          <p className="display h3" style={{ paddingTop: 4 }}>Esto no es factible de forma segura</p>
        </div>
        <p className="t15">
          Serían {kg(res.amount)} kg en {res.weeks} semanas: casi {fmt(res.rate, 1)} kg por semana ({fmt(res.pct, 1)} % de tu peso).
          {' '}Para {verb}, lo seguro es {fmt(res.min, 1)} a {fmt(res.max, 1)} kg por semana{res.kind === 'lose' ? ', nunca más del 1 % de tu peso' : ''}.
        </p>
        <div className="card stack g4" style={{ border: 0 }}>
          <p className="small muted">Con un ritmo seguro</p>
          <p className="display h2">Llegás en unos {span(res.safeWeeks)}</p>
          <p className="small">Y en {span(res.weeks)} ya vas a notar cambios: unos {rangeKg(res.inPlan)} {res.kind === 'lose' ? 'menos' : 'más'}.</p>
        </div>
      </div>
    )
  }
  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={key} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          {body}
        </motion.div>
      </AnimatePresence>
      <p className="sr-only">Peso actual {kg(weight)} kg</p>
    </div>
  )
}

/* Datos del cuerpo */
export function BodyForm({ v, onChange }) {
  const set = (k) => (x) => onChange({ ...v, [k]: x })
  return (
    <>
      <div className="grid2">
        <label className="field"><span className="lbl">Altura</span>
          <span className="row g4"><input inputMode="numeric" value={v.height} onChange={(e) => set('height')(+e.target.value.replace(/\D/g, '').slice(0, 3) || '')} aria-label="Altura en centímetros" /><span className="fw6">cm</span></span>
        </label>
        <label className="field"><span className="lbl">Peso</span>
          <span className="row g4"><input inputMode="decimal" value={String(v.weight).replace('.', ',')} onChange={(e) => { const t = e.target.value.replace(',', '.'); if (/^\d{0,3}(\.\d?)?$/.test(t)) set('weight')(t.endsWith('.') ? t : +t || '') }} aria-label="Peso en kilos" /><span className="fw6">kg</span></span>
        </label>
      </div>
      <label className="field"><span className="lbl">Fecha de nacimiento</span><input type="date" value={v.birth} max="2010-12-31" min="1930-01-01" onChange={(e) => set('birth')(e.target.value)} /></label>
      <div className="stack g8">
        <p className="small fw6 muted">Sexo para el cálculo</p>
        <div className="chips">{['Mujer', 'Hombre', 'Prefiero no decir'].map((x) => <Chip key={x} on={v.sex === x} tone="training" onClick={() => set('sex')(x)}>{x}</Chip>)}</div>
      </div>
      <div className="stack g8">
        <p className="small fw6 muted">Cuánto te movés fuera del gimnasio</p>
        <div className="chips">{[['Poco', 'Poco (oficina)'], ['Algo', 'Algo (camino bastante)'], ['Mucho', 'Mucho (trabajo de pie)']].map(([id, l]) => <Chip key={id} on={v.activity === id} tone="training" onClick={() => set('activity')(id)}>{l}</Chip>)}</div>
      </div>
      <div className="notice tint-primary">
        <div className="stack g4">
          <p className="t">¿Por qué te preguntamos esto?</p>
          <p>El gasto diario cambia según tu cuerpo y tu actividad. Si preferís no decir tu sexo, usamos un promedio y lo ajustamos con tu tendencia de peso. No se comparte con nadie.</p>
        </div>
      </div>
    </>
  )
}

/* Cómo entrenás */
export function TrainingForm({ v, onChange }) {
  const set = (k) => (x) => onChange({ ...v, [k]: x })
  const group = (title, k, opts) => (
    <div className="stack g8">
      <p className="small fw6 muted">{title}</p>
      <div className="chips">{opts.map((o) => { const [val, l] = Array.isArray(o) ? o : [o, o]; return <Chip key={val} on={v[k] === val} onClick={() => set(k)(val)}>{l}</Chip> })}</div>
    </div>
  )
  return (
    <>
      {group('Tu nivel', 'level', [['Principiante', 'Recién empiezo'], 'Intermedio', 'Avanzado'])}
      {group('Días por semana', 'days', [2, 3, 4, 5, 6])}
      {group('Tiempo por sesión', 'minutes', [[30, '30 min'], [45, '45 min'], [60, '60 min'], [90, '90 min']])}
      {group('Dónde entrenás', 'place', ['Gimnasio completo', 'Casa o poco equipo', 'Un poco de cada'])}
    </>
  )
}
