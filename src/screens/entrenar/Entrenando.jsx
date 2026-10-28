import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { DAY, EXERCISES } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Chip, Screen, Seg, Sheet, Tap, Thumb } from '../../components/ui'
import { fmt } from '../../lib/format'

const mmss = (ms) => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` }
const clock = (ms) => { const t = Math.floor(ms / 1000); const h = Math.floor(t / 3600); const m = Math.floor((t % 3600) / 60); return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(t % 60).padStart(2, '0')}` }
const buzz = (p) => { try { navigator.vibrate?.(p) } catch { /* sin vibración */ } }

const ZONES = ['Rodilla', 'Hombro', 'Zona lumbar', 'Cadera', 'Muñeca', 'Codo']
const SAFE_FOR = { Rodilla: (e) => e.knee, Hombro: (e) => e.region === 'lower', 'Zona lumbar': (e) => !['rdl', 'pull', 'goblet'].includes(e.id), Cadera: (e) => e.region === 'upper' || e.machine, Muñeca: (e) => e.machine || e.region === 'lower', Codo: (e) => e.region === 'lower' }

// Alternativas reales con menos carga en la zona (para hip thrust con rodilla: puente con barra o pull-through)
function alternatives(id, zone) {
  if (id === 'hip' && zone === 'Rodilla') return [
    { id: 'puente-barra', why: 'Mismo músculo, rodilla sin carga' },
    { id: 'pull', why: 'Misma extensión de cadera, rodilla casi fija' },
  ]
  const ex = EXERCISES[id]
  // primero sus alternativas, después los que trabajan el mismo músculo principal y, al final, alguno de sus otros músculos
  const all = Object.keys(EXERCISES)
  const pool = [...ex.alts, ...all.filter((k) => EXERCISES[k].muscles[0] === ex.muscles[0]), ...all.filter((k) => EXERCISES[k].muscles.some((m) => ex.muscles.includes(m)))]
  return [...new Set(pool)].filter((k) => k !== id && SAFE_FOR[zone](EXERCISES[k])).slice(0, 2)
    .map((k) => ({ id: k, why: `Trabaja ${EXERCISES[k].muscle.toLowerCase()} con menos carga en ${zoneText(zone)}` }))
}
const zoneText = (z) => (z === 'Zona lumbar' ? 'la zona lumbar' : `${z === 'Hombro' || z === 'Codo' ? 'el' : 'la'} ${z.toLowerCase()}`)

function MolestiaSheet({ open, close, current, onSwap, onStop }) {
  const s = useStore()
  const base = s.injuries[0]?.zone.split(' ')[0] || 'Rodilla'
  const [zone, setZone] = useState(ZONES.includes(base) ? base : 'Rodilla')
  const [level, setLevel] = useState('Leve')
  const alts = alternatives(current, zone)
  return (
    <Sheet open={open} onClose={close} title="¿Dónde sentís molestia?">
      <div className="chips" role="group" aria-label="Zona">
        {ZONES.map((z) => <Chip key={z} on={zone === z} tone="warn" onClick={() => setZone(z)}>{z}</Chip>)}
      </div>
      <Seg id="intensidad" options={['Leve', 'Moderada', 'Fuerte']} value={level} onChange={setLevel} label="Intensidad" />
      <AnimatePresence mode="wait" initial={false}>
        {level === 'Fuerte' ? (
          <motion.div key="fuerte" className="notice tint-warn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="stack g8">
              <p className="t warn-title">Mejor frená por hoy</p>
              <p>Con dolor fuerte no conviene seguir. Si no se va en unos días, consultá con un kinesiólogo o un médico.</p>
              <div><Btn kind="sm ink" onClick={onStop}>Terminar por hoy</Btn></div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={zone} className="stack g10" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="t15 fw6">Te sugerimos, con menos carga en {zoneText(zone)}:</p>
            {alts.length === 0 && <p className="small muted">{SAFE_FOR[zone](EXERCISES[current]) ? 'Este ejercicio ya cuida esa zona. Probá bajar el peso o el rango de movimiento.' : 'No tenemos una alternativa para esa zona. Probá bajar el peso o saltear este ejercicio por hoy.'}</p>}
            {alts.map((a) => (
              <div key={a.id} className="card soft tint-primary row g12" style={{ padding: 12 }}>
                <Thumb src={EXERCISES[a.id].img} alt="" size={48} radius={12} />
                <div className="grow stack g4"><p className="fw6 t15">{EXERCISES[a.id].name}</p><p className="xs muted">{a.why}</p></div>
                <Btn kind="sm ink" onClick={() => onSwap(a.id)}>Cambiar</Btn>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="xs muted">Si el dolor es fuerte o no se va, frená y consultá a un profesional. La app sugiere alternativas, no diagnostica.</p>
    </Sheet>
  )
}

export default function Entrenando() {
  const s = useStore()
  const navigate = useNavigate()
  // mientras la pantalla sale animada, seguimos mostrando la última sesión
  const live = s.session
  const keep = useRef(live)
  if (live) keep.current = live
  const leaving = useRef(false)
  const ses = live || keep.current
  const [now, setNow] = useState(Date.now())
  const [pain, setPain] = useState(false)
  const [ask, setAsk] = useState(false)
  const restDone = useRef(null)

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t) }, [])

  // fin del descanso: vibra si el teléfono lo permite
  const resting = ses?.restEnds && ses.restEnds > now
  useEffect(() => {
    if (!live?.restEnds) return
    if (ses.restEnds <= now && restDone.current !== ses.restEnds) {
      restDone.current = ses.restEnds
      buzz([180, 90, 180])
      s.updateSession((x) => ({ ...x, restEnds: null }))
      s.notify('¡Descanso listo! A la próxima serie.', 'entreno')
    }
  }, [now, ses?.restEnds]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ses || (!live && !leaving.current)) return <Navigate to="/entrenar" replace />

  const item = ses.items[ses.idx]
  const ex = EXERCISES[item.id]
  const ref = DAY.items.find((d) => d.id === item.id)
  const doneSets = item.sets.filter((x) => x.done).length
  const current = item.sets.findIndex((x) => !x.done)
  const complete = current === -1
  const last = ses.idx === ses.items.length - 1
  const next = ses.items[ses.idx + 1]

  const edit = (i, k, v) => s.updateSession((x) => {
    const items = x.items.map((it, j) => (j !== x.idx ? it : { ...it, sets: it.sets.map((z, n) => (n === i ? { ...z, [k]: v } : z)) }))
    return { ...x, items }
  })
  const toggle = (i) => {
    const willBeDone = !item.sets[i].done
    buzz(15)
    s.updateSession((x) => {
      const items = x.items.map((it, j) => (j !== x.idx ? it : { ...it, sets: it.sets.map((z, n) => (n === i ? { ...z, done: willBeDone } : z)) }))
      const allDone = items[x.idx].sets.every((z) => z.done)
      // al completar una serie arranca el descanso (salvo la última del último ejercicio)
      const rest = willBeDone && !(allDone && x.idx === x.items.length - 1)
      return { ...x, items, restEnds: rest ? Date.now() + item.rest * 1000 : x.restEnds && willBeDone ? x.restEnds : null, restTotal: item.rest }
    })
  }
  const goTo = (i) => s.updateSession((x) => ({ ...x, idx: i, restEnds: null }))
  const finish = () => { leaving.current = true; s.finishWorkout(); navigate('/entrenar/listo', { replace: true }) }
  const swap = (id) => {
    const alt = EXERCISES[id]
    s.updateSession((x) => ({ ...x, items: x.items.map((it, j) => (j !== x.idx ? it : { ...it, id, sets: it.sets.map((z) => ({ ...z, prev: [alt.kg, z.reps], kg: alt.kg, done: false })) })) }))
    setPain(false)
    s.notify(`Cambiamos a ${alt.name.toLowerCase()}`, 'entreno')
  }

  const restLeft = resting ? ses.restEnds - now : 0
  const tip = ref?.suggest
    ? <>La vez pasada hiciste {fmt(ref.last[0][0], 1)} kg × {ref.last[0][1]}. Hoy probá {fmt(ref.suggest, 1)} kg.</>
    : <>La vez pasada: {fmt(item.sets[0].prev[0], 1)} kg × {item.sets[0].prev[1]}. Mantené el peso y cuidá la técnica.</>

  const bottom = resting ? (
    <motion.div className="rest" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} role="timer" aria-label="Descanso">
      <div className="grow stack">
        <span className="small" style={{ opacity: 0.8 }}>Descanso</span>
        <span className="num" style={{ fontSize: 30, lineHeight: 1.05 }}>{mmss(restLeft)}</span>
      </div>
      <Btn kind="sm" onClick={() => s.updateSession((x) => ({ ...x, restEnds: x.restEnds + 15000, restTotal: x.restTotal + 15 }))}>+15 s</Btn>
      <Btn kind="sm" onClick={() => s.updateSession((x) => ({ ...x, restEnds: null }))}>Saltar</Btn>
      <div className="rest-track"><motion.div className="rest-fill" style={{ width: '100%', scaleX: restLeft / (ses.restTotal * 1000) }} /></div>
    </motion.div>
  ) : complete ? (
    last
      ? <Btn onClick={finish}>Terminar entrenamiento</Btn>
      : <Btn onClick={() => goTo(ses.idx + 1)}>Siguiente: {EXERCISES[next.id].name}</Btn>
  ) : null

  return (
    <Screen nav={false} action={bottom} label="Entrenando">
      <div className="topbar">
        <Btn kind="ghost" className="back" onClick={() => setAsk(true)} style={{ width: 'auto' }}><Icon name="close" size={20} /> Terminar</Btn>
        <span className="num" style={{ fontSize: 20 }} aria-label="Tiempo de entrenamiento">{clock(now - ses.startedAt)}</span>
      </div>

      <div className="seg-bar" aria-label={`Ejercicio ${ses.idx + 1} de ${ses.items.length}`}>
        {ses.items.map((it, i) => (
          <button key={i} type="button" aria-label={`Ir a ${EXERCISES[it.id].name}`} onClick={() => goTo(i)}>
            <motion.span initial={false} animate={{ background: i <= ses.idx || it.sets.every((z) => z.done) ? 'var(--training)' : 'var(--line)' }} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section key={`${ses.idx}-${item.id}`} className="card soft tint-training stack g10" style={{ padding: 20 }}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <div className="row between g12" style={{ alignItems: 'flex-start' }}>
            <div className="stack g8 grow">
              <p className="label">Ejercicio {ses.idx + 1} de {ses.items.length}</p>
              <h1 className="display h1">{ex.name}</h1>
            </div>
            <Character forma="entreno" expr={resting ? 'cansado' : complete ? 'satisfecho' : 'energia'} level={(doneSets / item.sets.length) * 100} size={64} />
          </div>
          <p className="t15">{item.sets.length} series · {/^[\d\sa]+$/.test(item.reps) ? `${item.reps} reps` : item.reps} · descanso {item.rest} s</p>
          <div className="row g8 wrap">
            {ex.muscles.slice(0, 2).map((m) => <span key={m} className="chip static" style={{ minHeight: 34 }}>{m}</span>)}
            <Link to={`/entrenar/ejercicio/${item.id}`} state={{ from: 'Entrenando' }} className="link" style={{ minHeight: 44 }}>Ver técnica</Link>
          </div>
        </motion.section>
      </AnimatePresence>

      <p className="small row g8" style={{ alignItems: 'flex-start' }}><i className="dot-s" style={{ background: 'var(--rest)', marginTop: 5 }} /><span>{tip}</span></p>

      <div className="card" style={{ padding: '12px 16px' }}>
        <div className="sets" role="table" aria-label="Series">
          <span className="h">Serie</span><span className="h">Anterior</span><span className="h tc">Kg</span><span className="h tc">Reps</span><span className="h" />
          {item.sets.map((z, i) => (
            <motion.div key={i} className={`set-row${i === current && !resting ? ' current' : ''}${z.done ? ' done' : ''}`} role="row"
              animate={{ opacity: z.done ? 0.62 : 1 }} transition={{ duration: 0.25 }}>
              <span className="n">{i + 1}</span>
              <span className="prev">{fmt(z.prev[0], 1)} × {z.prev[1]}</span>
              <input className="set-in" inputMode="decimal" aria-label={`Kilos serie ${i + 1}`} value={String(z.kg).replace('.', ',')}
                onChange={(e) => { const v = e.target.value.replace(',', '.'); if (/^\d{0,3}([.]\d{0,2})?$/.test(v)) edit(i, 'kg', v === '' ? '' : v.endsWith('.') ? v : +v) }} />
              <input className="set-in" inputMode="numeric" aria-label={`Repeticiones serie ${i + 1}`} value={z.reps}
                onChange={(e) => { const v = e.target.value; if (/^\d{0,2}$/.test(v)) edit(i, 'reps', v === '' ? '' : +v) }} />
              <motion.button type="button" className={`round-check${z.done ? ' on' : ''}`} onClick={() => toggle(i)}
                aria-label={z.done ? `Desmarcar serie ${i + 1}` : `Marcar serie ${i + 1} como hecha`} aria-pressed={z.done}
                whileTap={{ scale: 0.85 }} animate={z.done ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}
                style={{ justifySelf: 'center' }}>
                <Icon name="check" size={18} stroke={2.4} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="t15">¿Te molesta algo? <button type="button" className="link" onClick={() => setPain(true)}>Cambiar por una alternativa</button></p>

      {next && (
        <Tap className="card next-card row g14" onClick={() => goTo(ses.idx + 1)} aria-label={`A continuación: ${EXERCISES[next.id].name}`}>
          <span className="num muted" style={{ fontSize: 24 }}>{ses.idx + 2}</span>
          <span className="stack g4 grow"><span className="xs muted">A continuación</span><span className="fw6 t15">{EXERCISES[next.id].name} · {next.sets.length} × {next.reps}</span></span>
          <Icon name="chevron" size={18} style={{ color: 'var(--muted)' }} />
        </Tap>
      )}

      <MolestiaSheet open={pain} close={() => setPain(false)} current={item.id} onSwap={swap} onStop={() => { setPain(false); finish() }} />
      <Sheet open={ask} onClose={() => setAsk(false)} title="¿Terminás por hoy?">
        <p className="t15 muted">Guardamos lo que hiciste hasta acá. No se pierde nada.</p>
        <Btn onClick={finish}>Terminar y guardar</Btn>
        <Btn kind="sec" onClick={() => setAsk(false)}>Seguir entrenando</Btn>
        <button type="button" className="link" style={{ alignSelf: 'center', minHeight: 44 }} onClick={() => { leaving.current = true; s.cancelWorkout(); navigate('/entrenar', { replace: true }) }}>Descartar este entrenamiento</button>
      </Sheet>
    </Screen>
  )
}
