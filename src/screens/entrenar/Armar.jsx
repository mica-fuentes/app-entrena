import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, Reorder, motion, useDragControls } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store'
import { EXERCISES, READY_ROUTINES } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Check, Chip, Screen, Sheet, Tap, Thumb, Title, TopBar, useBack } from '../../components/ui'
import { bestDay, coverage, suggestions } from '../../lib/coverage'
import { DAYS, joinY } from '../../lib/format'

const lower = (t) => t.charAt(0).toLowerCase() + t.slice(1)
const short = (m) => (m === 'Isquiotibiales' ? 'isquios' : lower(m))

/* Agregar ejercicios: primero los músculos que te faltan */
export function Agregar() {
  const s = useStore()
  const back = useBack('/entrenar/rutina')
  const [q] = useSearchParams()
  const toDraft = q.get('para') === 'borrador'
  const dayIdx = +(q.get('dia') || 0)
  const r = toDraft ? s.draft : s.routines.find((x) => x.id === q.get('id')) || s.routine
  const plan = r?.plan || [[]]
  const cov = coverage(plan)
  const sugg = suggestions(plan)
  const missing = cov.missing.map((m) => m.name)
  const [mus, setMus] = useState(missing.slice(0, 2))
  const [dumb, setDumb] = useState(false)
  const [text, setText] = useState('')
  const [picked, setPicked] = useState(() => {
    // preseleccionamos uno por cada músculo que falta
    const out = []
    missing.slice(0, 2).forEach((m) => { const e = sugg.find((x) => x.muscles.includes(m) && !out.includes(x.id)); if (e) out.push(e.id) })
    return out
  })
  const inPlan = new Set(plan.flat().map((p) => p.id))
  const pool = Object.values(EXERCISES).filter((e) => !inPlan.has(e.id))
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const list = pool
    .filter((e) => (!mus.length || e.muscles.some((m) => mus.includes(m))) && (!dumb || e.dumbbell) && (!text || norm(e.name).includes(norm(text))))
    .sort((a, b) => (b.knee - a.knee) || (picked.includes(b.id) - picked.includes(a.id)))
  const toggle = (id) => setPicked((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]))
  const add = () => {
    const newPlan = plan.map((d) => [...d])
    picked.forEach((id) => {
      const i = toDraft ? dayIdx : bestDay(newPlan, id)
      newPlan[i].push({ id, sets: 3, reps: '10', rest: 60 })
    })
    if (toDraft) s.set((st) => ({ draft: { ...st.draft, plan: newPlan } }))
    else s.set((st) => ({ routines: st.routines.map((x) => (x.id === r.id ? { ...x, plan: newPlan } : x)) }))
    s.notify(`Sumamos ${picked.length} ejercicio${picked.length > 1 ? 's' : ''} a tu rutina`, 'entreno')
    back()
  }
  if (!r) return null
  return (
    <Screen action={<Btn disabled={!picked.length} onClick={add}>{picked.length ? `Agregar ${picked.length} ejercicio${picked.length > 1 ? 's' : ''}` : 'Elegí al menos uno'}</Btn>}>
      <TopBar back={toDraft ? 'Nueva rutina' : 'Tu rutina'} to="/entrenar/rutina" />
      <Title>Agregar ejercicios</Title>
      <label className="search">
        <Icon name="search" size={20} style={{ color: 'var(--muted)' }} />
        <input type="search" placeholder="Buscar ejercicio" value={text} onChange={(e) => setText(e.target.value)} aria-label="Buscar ejercicio" />
      </label>
      <div className="chips">
        {(missing.length ? missing : ['Glúteos', 'Espalda alta']).map((m) => (
          <Chip key={m} on={mus.includes(m)} tone="training" onClick={() => setMus((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))}>{m === 'Isquiotibiales' ? 'Isquios' : m}</Chip>
        ))}
        <Chip on={dumb} tone="training" onClick={() => setDumb((d) => !d)}>Mancuernas</Chip>
      </div>
      {missing.length > 0 && <p className="small muted">Te faltan {joinY(missing.map(short))}: te mostramos primero esos.</p>}
      <div className="card list">
        <AnimatePresence initial={false}>
          {list.map((e) => {
            const on = picked.includes(e.id)
            return (
              <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Tap className="list-item" onClick={() => toggle(e.id)} role="checkbox" aria-checked={on}>
                  <Thumb src={e.img} alt="" size={56} />
                  <span className="grow stack g4">
                    <span className="t">{e.name}</span>
                    <span className="d">{e.muscle} · {lower(e.equip)}</span>
                    {e.knee && <span className="tag">Sin carga en rodilla</span>}
                  </span>
                  <Check on={on} />
                </Tap>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {list.length === 0 && <p className="small muted" style={{ padding: '16px 0' }}>No hay más ejercicios con ese filtro.</p>}
      </div>
    </Screen>
  )
}

/* Armar rutina: nombre, días, pestañas por día y reordenar arrastrando */
function DragRow({ item, onRemove }) {
  const controls = useDragControls()
  const ex = EXERCISES[item.id]
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} className="drag-row"
      whileDrag={{ scale: 1.03, boxShadow: '0 12px 30px rgba(0,0,0,.16)', borderRadius: 14, zIndex: 5 }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}>
      <button type="button" className="hit handle" aria-label={`Mover ${ex.name}`} onPointerDown={(e) => controls.start(e)}>
        <Icon name="drag" size={20} stroke={2.6} />
      </button>
      <Thumb src={ex.img} alt="" size={48} radius={12} />
      <span className="grow stack g4"><span className="fw6 t15">{ex.name}</span><span className="small muted">{item.sets} × {item.reps}</span></span>
      <button type="button" className="hit" aria-label={`Quitar ${ex.name}`} onClick={onRemove} style={{ color: 'var(--muted)' }}><Icon name="close" size={18} /></button>
    </Reorder.Item>
  )
}

export function Armar() {
  const s = useStore()
  const navigate = useNavigate()
  const back = useBack('/entrenar')
  const [q] = useSearchParams()
  const editing = q.get('id')
  const key = editing || 'nueva'
  const [tab, setTab] = useState(0)

  // el borrador vive en el estado para no perderlo al ir a "Agregar ejercicios"
  useEffect(() => {
    if (s.draft?.key === key) return
    const base = s.routines.find((x) => x.id === editing) || s.routine
    s.set({ draft: { ...JSON.parse(JSON.stringify(base)), key, id: editing || `r${Date.now()}`, name: editing ? base.name : 'Mi rutina nueva', by: editing ? base.by : 'Armada por vos' } })
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const keep = useRef(null)
  if (s.draft?.key === key) keep.current = s.draft
  const d = keep.current // al guardar, la pantalla sale mostrando el último borrador
  if (!d) return null
  const upd = (patch) => s.set((st) => ({ draft: { ...st.draft, ...patch } }))
  const toggleDay = (i) => {
    const days = d.days.includes(i) ? d.days.filter((x) => x !== i) : [...d.days, i].sort()
    if (!days.length || days.length > 6) return
    const plan = Array.from({ length: days.length }, (_, k) => d.plan[k] || [])
    const titles = Array.from({ length: days.length }, (_, k) => d.titles[k] || `Día ${k + 1}`)
    upd({ days, plan, titles })
    if (tab >= days.length) setTab(days.length - 1)
  }
  const setDayItems = (items) => upd({ plan: d.plan.map((x, k) => (k === tab ? items : x)) })
  const cov = coverage(d.plan)
  const save = () => {
    s.set((st) => {
      const { key: _k, ...r } = st.draft
      const exists = st.routines.some((x) => x.id === r.id)
      return { routines: exists ? st.routines.map((x) => (x.id === r.id ? r : x)) : [...st.routines, r], activeRoutine: exists ? st.activeRoutine : r.id, draft: null }
    })
    s.notify(editing ? 'Rutina guardada' : `"${d.name}" es tu nueva rutina activa`, 'entreno')
    if (editing) back()
    else navigate('/entrenar', { replace: true })
  }
  const items = d.plan[tab] || []
  return (
    <Screen action={<Btn onClick={save} disabled={!d.name.trim()}>Guardar rutina</Btn>}>
      <TopBar back="Entrenar" to="/entrenar" />
      <Title>{editing ? 'Editar rutina' : 'Nueva rutina'}</Title>
      <label className="field">
        <span className="lbl">Nombre</span>
        <input value={d.name} onChange={(e) => upd({ name: e.target.value })} maxLength={40} />
      </label>
      <div className="stack g10">
        <p className="t15 fw6">¿Qué días entrenás?</p>
        <div className="week">
          {DAYS.map((x, i) => (
            <motion.button key={i} type="button" className={`daydot${d.days.includes(i) ? ' on' : ''}`} onClick={() => toggleDay(i)} aria-pressed={d.days.includes(i)} whileTap={{ scale: 0.9 }}
              aria-label={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i]}>{x}</motion.button>
          ))}
        </div>
      </div>
      <div className="scroll-x" role="tablist" aria-label="Días de la rutina">
        {d.plan.map((_, i) => <Chip key={i} on={tab === i} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>Día {i + 1}</Chip>)}
      </div>
      <label className="field" style={{ minHeight: 56 }}>
        <span className="lbl">Nombre del día {tab + 1}</span>
        <input value={d.titles[tab] || ''} onChange={(e) => upd({ titles: d.titles.map((t, k) => (k === tab ? e.target.value : t)) })} />
      </label>
      <div className="card" style={{ padding: '6px 12px' }}>
        {items.length ? (
          <Reorder.Group axis="y" values={items} onReorder={setDayItems} className="drag-list">
            <AnimatePresence initial={false}>
              {items.map((it) => <DragRow key={it.id} item={it} onRemove={() => setDayItems(items.filter((x) => x !== it))} />)}
            </AnimatePresence>
          </Reorder.Group>
        ) : <p className="small muted" style={{ padding: '16px 4px' }}>Todavía no hay ejercicios en este día.</p>}
      </div>
      <Btn kind="dashed" to={`/entrenar/agregar?para=borrador&dia=${tab}`}>+ Agregar ejercicio</Btn>
      <div className="notice tint-rest" style={{ alignItems: 'center' }}>
        <Character forma="entreno" expr="contento" level={cov.pct} size={44} />
        <div className="stack g4">
          <p className="t">Cobertura semanal: {cov.pct}%</p>
          <p>{cov.missing.length ? `Faltan ${joinY(cov.missing.slice(0, 2).map((m) => short(m.name)))}.` : 'Cubre todos los músculos.'}{' '}
            {cov.missing.length > 0 && <Tap to={`/entrenar/agregar?para=borrador&dia=${tab}`} className="link" style={{ minHeight: 0 }}>Ver sugerencias</Tap>}</p>
        </div>
      </div>
    </Screen>
  )
}

/* Rutinas listas */
export function Listas() {
  const s = useStore()
  const navigate = useNavigate()
  const tags = ['Tonificar', '3 días', 'Gimnasio', 'En casa', 'Principiante', 'Ganar músculo', '4 días']
  const [on, setOn] = useState(['Tonificar', '3 días'])
  const [view, setView] = useState(null)
  const list = READY_ROUTINES.filter((r) => on.every((t) => r.tags.includes(t)))
  const use = (r) => {
    const base = s.routines.find((x) => x.id === r.base) || s.routines[0]
    const id = `r${Date.now()}`
    s.set((st) => ({ routines: [...st.routines, { ...JSON.parse(JSON.stringify(base)), id, name: r.name, by: 'Rutina lista', img: r.img }], activeRoutine: id }))
    s.notify(`"${r.name}" es tu rutina activa`, 'entreno')
    setView(null)
    navigate(`/entrenar/rutina?id=${id}`)
  }
  return (
    <Screen>
      <TopBar back="Entrenar" to="/entrenar" />
      <Title sub="Armadas para cada objetivo. Las podés editar como quieras.">Rutinas listas</Title>
      <div className="scroll-x">
        {tags.map((t) => <Chip key={t} on={on.includes(t)} tone="training" onClick={() => setOn((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}>{t}</Chip>)}
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {list.map((r) => (
          <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
            <Tap className={`card soft tint-${r.tone} row g14 ready`} onClick={() => setView(r)}>
              <Thumb src={r.img} alt="" size={68} radius={16} />
              <span className="stack g6 grow">
                <span className="display h3">{r.name}</span>
                <span className="small">{r.desc}</span>
                <span className="tag line">Cubre todos los músculos</span>
              </span>
            </Tap>
          </motion.div>
        ))}
      </AnimatePresence>
      {list.length === 0 && (
        <div className="card center-stack" style={{ padding: 24 }}>
          <Character forma="entreno" expr="contento" level={30} size={52} />
          <p className="t15">No hay rutinas con todos esos filtros.</p>
          <Btn kind="sm surface" onClick={() => setOn([])}>Ver todas</Btn>
        </div>
      )}
      <Sheet open={!!view} onClose={() => setView(null)} title={view?.name}>
        {view && <>
          <p className="t15 muted">{view.desc}</p>
          <div className="card list">
            {(s.routines.find((x) => x.id === view.base) || s.routines[0]).plan.map((d, i) => (
              <div key={i} className="list-item" style={{ cursor: 'default' }}>
                <span className="stack g4"><span className="t">Día {i + 1}</span><span className="d">{d.map((p) => EXERCISES[p.id].name).join(' · ')}</span></span>
              </div>
            ))}
          </div>
          <Btn onClick={() => use(view)}>Usar esta rutina</Btn>
        </>}
      </Sheet>
    </Screen>
  )
}
