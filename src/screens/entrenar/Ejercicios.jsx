import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useParams } from 'react-router-dom'
import { useStore } from '../../store'
import { EXERCISES, LIBRARY_ORDER } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Chip, Screen, SectionHead, Sheet, Tap, Thumb, Title, TopBar } from '../../components/ui'
import { bestDay } from '../../lib/coverage'

const FILTERS = [
  { id: 'Glúteos', test: (e) => e.muscles.includes('Glúteos') },
  { id: 'Cuida rodillas', test: (e) => e.knee },
  { id: 'Mancuernas', test: (e) => e.dumbbell },
  { id: 'En casa', test: (e) => e.home },
  { id: 'Máquinas', test: (e) => e.machine },
  { id: 'Principiante', test: (e) => e.level === 'Principiante' },
]
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function Biblioteca() {
  const [q, setQ] = useState('')
  const [on, setOn] = useState(['Glúteos', 'Cuida rodillas'])
  const toggle = (f) => setOn((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))
  const list = LIBRARY_ORDER.map((id) => EXERCISES[id]).filter((e) =>
    FILTERS.filter((f) => on.includes(f.id)).every((f) => f.test(e)) &&
    (!q || norm(`${e.name} ${e.muscle} ${e.equip}`).includes(norm(q))))
  const glutes = on.includes('Glúteos')
  return (
    <Screen>
      <TopBar back="Entrenar" to="/entrenar" />
      <Title>Ejercicios</Title>
      <label className="search">
        <Icon name="search" size={20} style={{ color: 'var(--muted)' }} />
        <input type="search" placeholder="Buscar: sentadilla, glúteo, mancuerna…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar ejercicio" />
        {q && <button type="button" className="hit" aria-label="Borrar búsqueda" onClick={() => setQ('')} style={{ marginRight: -10 }}><Icon name="close" size={16} /></button>}
      </label>
      <div className="chips" role="group" aria-label="Filtros">
        {FILTERS.map((f) => <Chip key={f.id} on={on.includes(f.id)} tone={f.id === 'Cuida rodillas' ? 'rest' : 'training'} onClick={() => toggle(f.id)}>{f.id}</Chip>)}
      </div>
      <p className="small muted" aria-live="polite">{list.length} {list.length === 1 ? 'ejercicio' : 'ejercicios'}{glutes ? ' · ordenados por cuánto trabajan glúteos' : ''}</p>
      {list.length > 0 ? (
        <div className="card list">
          <AnimatePresence initial={false}>
            {list.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                <Tap to={`/entrenar/ejercicio/${e.id}`} state={{ from: 'Ejercicios' }} className="list-item" style={{ alignItems: 'center' }}>
                  <Thumb src={e.img} alt="" size={60} />
                  <span className="grow stack g4">
                    <span className="t">{e.name}</span>
                    <span className="d">{e.equip} · {e.level}</span>
                    {e.knee && <span className="tag">Sin carga en rodilla</span>}
                  </span>
                </Tap>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card center-stack" style={{ padding: 24 }}>
          <Character forma="entreno" expr="cansado" level={30} size={56} />
          <p className="t15 fw6">No encontramos ejercicios con esos filtros</p>
          <Btn kind="sm surface" onClick={() => { setOn([]); setQ('') }}>Sacar filtros</Btn>
        </div>
      )}
    </Screen>
  )
}

/* Detalle del ejercicio, con video simulado */
function FakeVideo({ ex }) {
  const [play, setPlay] = useState(false)
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!play) return
    const i = setInterval(() => setT((x) => (x >= 42 ? (setPlay(false), 0) : x + 1)), 1000)
    return () => clearInterval(i)
  }, [play])
  return (
    <div className="photo-wrap video">
      {ex.img ? <img src={ex.img} alt={`Foto de ${ex.name}`} className="photo" style={{ borderRadius: 0 }} /> : <div className="photo tint-training" style={{ display: 'grid', placeItems: 'center', borderRadius: 0 }}><Character forma="entreno" expr="energia" level={60} size={80} /></div>}
      <motion.div className="video-shade" animate={{ opacity: play ? 0 : 1 }} />
      <button type="button" className="play" onClick={() => setPlay((p) => !p)} aria-label={play ? 'Pausar video' : 'Ver técnica en video'}>
        <motion.span className="play-btn" animate={{ scale: play ? 0.7 : 1, opacity: play ? 0.0 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}><Icon name="play" size={26} color="#16171D" /></motion.span>
        {!play && <span className="play-lbl">Ver técnica · 0:42</span>}
      </button>
      {(play || t > 0) && (
        <div className="video-bar"><motion.span animate={{ width: `${(t / 42) * 100}%` }} transition={{ ease: 'linear', duration: 1 }} /><span className="xs">0:{String(t).padStart(2, '0')} / 0:42 · video simulado</span></div>
      )}
    </div>
  )
}

export function Detalle() {
  const { id } = useParams()
  const loc = useLocation()
  const s = useStore()
  const [pick, setPick] = useState(false)
  const ex = EXERCISES[id] || EXERCISES.hip
  const knee = s.injuries.some((i) => i.zone.toLowerCase().includes('rodilla'))
  const r = s.routine
  const where = r.plan.findIndex((d) => d.some((p) => p.id === ex.id))
  const add = (i) => {
    const plan = r.plan.map((d, j) => (j === i ? [...d, { id: ex.id, sets: 3, reps: '10', rest: 60 }] : d))
    s.set((st) => ({ routines: st.routines.map((x) => (x.id === r.id ? { ...x, plan } : x)) }))
    setPick(false)
    s.notify(`Sumamos ${ex.name.toLowerCase()} al día ${i + 1}`, 'entreno')
  }
  return (
    <Screen action={where >= 0
      ? <Btn kind="sec" to={`/entrenar/dia/${where}`}>Ya está en tu rutina · Ver día {where + 1}</Btn>
      : <Btn onClick={() => setPick(true)}>Agregar a mi rutina</Btn>}>
      <TopBar back={loc.state?.from || 'Ejercicios'} to="/entrenar/ejercicios" />
      <FakeVideo ex={ex} />
      <Title sub={`${ex.equip} · ${ex.level}`}>{ex.name}</Title>
      <div className="chips">
        {ex.muscles.map((m, i) => <span key={m} className={`chip static${i === 0 ? ' on training' : ''}`}>{m}{i === 0 ? ' · principal' : ''}</span>)}
      </div>
      <SectionHead title="Cómo hacerlo" />
      <ol className="card steps">
        {ex.steps.map((st, i) => <li key={i}><span className="num">{i + 1}</span><span className="t15">{st}</span></li>)}
      </ol>
      {knee && (ex.kneeTip || !ex.knee) && (
        <div className="notice tint-warn">
          <div className="stack g4">
            <p className="t">Si te molesta la rodilla</p>
            <p>{ex.kneeTip || 'Este ejercicio carga la rodilla. Probá una de las alternativas o bajá el rango de movimiento.'}</p>
          </div>
        </div>
      )}
      {ex.alts.length > 0 && <>
        <SectionHead title="Alternativas" />
        <div className="chips">
          {ex.alts.map((a) => <Tap key={a} to={`/entrenar/ejercicio/${a}`} state={{ from: ex.name }} className="chip">{EXERCISES[a].name}</Tap>)}
        </div>
      </>}
      <Sheet open={pick} onClose={() => setPick(false)} title="¿A qué día lo sumamos?">
        <p className="small muted">Te recomendamos el día {bestDay(r.plan, ex.id) + 1}: trabaja la misma zona del cuerpo.</p>
        {r.plan.map((d, i) => (
          <Tap key={i} className={`opt${i === bestDay(r.plan, ex.id) ? ' on' : ''}`} onClick={() => add(i)}>
            <span className="grow stack"><span className="t">Día {i + 1} · {r.titles[i]}</span><span className="d">{d.length} ejercicios</span></span>
            <Icon name="plus" size={20} />
          </Tap>
        ))}
      </Sheet>
    </Screen>
  )
}
