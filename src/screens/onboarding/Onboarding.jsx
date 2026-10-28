import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { APP_NAME } from '../../brand'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { BodyForm, GOALS, GoalFields, RealismResult, TrainingForm } from '../../components/Forms'
import { Btn, Chip, Screen, Seg, Tap } from '../../components/ui'
import { fmt, kg, liters } from '../../lib/format'
import { checkGoal, planNumbers } from '../../lib/goal'

const COLORS = ['var(--food)', 'var(--water)', 'var(--rest)', 'var(--training)', 'var(--food)', 'var(--water)', 'var(--rest)']
const ZONES = ['Rodilla', 'Hombro', 'Zona lumbar', 'Cadera', 'Muñeca', 'Codo']
const stepV = {
  enter: (d) => ({ x: d * 40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] } },
  exit: (d) => ({ x: d * -40, opacity: 0, transition: { duration: 0.18 } }),
}

const Float = ({ children, delay = 0, style }) => (
  <motion.div style={{ position: 'absolute', ...style }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
    transition={{ scale: { type: 'spring', stiffness: 260, damping: 14, delay }, opacity: { delay }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 } }}>
    {children}
  </motion.div>
)

export default function Onboarding() {
  const s = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const dir = useRef(1)
  const [goal, setGoal] = useState(s.goal.type)
  const [training, setTraining] = useState(s.training)
  const [body, setBody] = useState(s.body)
  const [zones, setZones] = useState(['Rodilla'])
  const [pain, setPain] = useState('Leve')
  const w = +body.weight || 67
  const [target, setTarget] = useState(Math.round((w - 15) * 2) / 2)
  const [weeks, setWeeks] = useState(8)
  const res = checkGoal({ weight: w, height: +body.height || 165, target, weeks })
  const n = planNumbers({ ...body, weight: w, goal, days: training.days })

  const go = (to) => { dir.current = to > step ? 1 : -1; setStep(to); document.querySelector('.page')?.scrollTo?.(0, 0) }
  const next = () => go(step + 1)
  const adjust = () => setTarget(Math.round((res.low ? res.minHealthy + 2 : w - res.max * weeks) * 2) / 2)
  const finish = (notifications) => {
    const injuries = zones.filter((z) => z !== 'Ninguna').map((z) => ({ id: z, zone: z === 'Rodilla' ? 'Rodilla derecha' : z, level: pain, since: 'Hace poco' }))
    s.set({ onboarded: true, notifications, goal: { type: goal, target, weeks }, body: { ...body, weight: w }, training, sessionsGoal: training.days, injuries, kcalGoal: n.kcal, tdee: n.tdee, deficit: n.deficit, protGoal: n.prot })
    navigate('/primer-dia', { replace: true })
  }
  const skip = () => { s.set({ onboarded: true }); navigate('/hoy', { replace: true }) }
  const knee = zones.includes('Rodilla')

  const toggleZone = (z) => setZones((x) => (z === 'Ninguna' ? ['Ninguna'] : x.includes(z) ? x.filter((y) => y !== z) : [...x.filter((y) => y !== 'Ninguna'), z]))

  const steps = [
    { // 1 · Bienvenida
      hero: true,
      action: <><Btn onClick={next}>Empezar</Btn><p className="small note" style={{ color: 'var(--ink)', opacity: 0.8 }}>Es gratis y no te pedimos tarjeta.</p></>,
      body: <>
        <div className="row g8" aria-label={APP_NAME}>
          <span className="logo-slot" aria-hidden="true"><Character forma="agua" expr="contento" level={70} size={18} breathe={false} /></span>
          <span className="fw6 t15">{APP_NAME}</span>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <Float delay={0.05} style={{ left: '2%', top: '12%' }}><Character forma="agua" expr="contento" level={75} size={104} /></Float>
          <Float delay={0.15} style={{ left: '33%', top: 0 }}><Character forma="comida" expr="energia" level={100} size={132} /></Float>
          <Float delay={0.25} style={{ right: '1%', top: '36%' }}><Character forma="entreno" expr="satisfecho" level={100} size={84} /></Float>
          <Float delay={0.35} style={{ left: '33%', top: '68%' }}><Character forma="descanso" expr="dormido" level={100} size={76} /></Float>
          <Float delay={0.5} style={{ left: '4%', top: '62%' }}><span className="pill">Comés</span></Float>
          <Float delay={0.6} style={{ right: '3%', top: '78%' }}><span className="pill">Entrenás</span></Float>
        </div>
        <h1 className="display welcome-title">Tu objetivo, sin poner en riesgo tu salud.</h1>
        <p className="t15">Respondé unas preguntas y armamos tu plan de entrenamiento y alimentación.</p>
        <button type="button" className="link" style={{ alignSelf: 'flex-start', fontWeight: 500 }} onClick={skip}>Ver la app con datos de ejemplo</button>
      </>,
    },
    { // 2 · Objetivo
      action: <Btn onClick={next}>Continuar</Btn>,
      body: <>
        <h1 className="display h1">¿Qué querés lograr?</h1>
        <p className="sub">Elegí lo que más se parezca. Después lo afinamos.</p>
        <div className="stack g10" role="radiogroup" aria-label="Objetivo">
          {GOALS.map((g) => (
            <Tap key={g.t} className={`opt${goal === g.t ? ' on' : ''}`} role="radio" aria-checked={goal === g.t} onClick={() => { setGoal(g.t); setTarget(g.t === 'Ganar músculo' ? w + 2 : g.t === 'Mantener' ? w : Math.round((w - 15) * 2) / 2) }}>
              <span className="radio" /><span className="stack"><span className="t">{g.t}</span><span className="d">{g.d}</span></span>
            </Tap>
          ))}
        </div>
      </>,
    },
    { // 3 · Cómo entrenás
      action: <Btn onClick={next}>Continuar</Btn>,
      body: <>
        <h1 className="display h1">¿Cómo entrenás?</h1>
        <TrainingForm v={training} onChange={setTraining} />
        <div className="notice tint-primary"><p>¿Tenés una rutina de tu profe? Después la cargás o armás la tuya.</p></div>
      </>,
    },
    { // 4 · Tus datos
      action: <Btn onClick={next} disabled={!(body.height >= 120 && w >= 30)}>Continuar</Btn>,
      body: <><h1 className="display h1">Contanos de vos</h1><BodyForm v={body} onChange={setBody} /></>,
    },
    { // 5 · Molestias
      action: <Btn onClick={next}>Continuar</Btn>,
      body: <>
        <h1 className="display h1">¿Tenés alguna molestia o lesión?</h1>
        <p className="sub">Podés elegir más de una. Con esto adaptamos los ejercicios.</p>
        <div className="chips">
          {[...ZONES, 'Ninguna'].map((z) => <Chip key={z} on={zones.includes(z)} tone="warn" onClick={() => toggleZone(z)}>{z}</Chip>)}
        </div>
        {!zones.includes('Ninguna') && zones.length > 0 && (
          <div className="stack g8"><p className="small fw6 muted">¿Cuánto te molesta?</p><Seg id="ob-dolor" options={['Leve', 'Moderada', 'Fuerte']} value={pain} onChange={setPain} label="Intensidad" /></div>
        )}
        <div className="notice tint-primary"><p>No diagnosticamos. Te sugerimos alternativas y, si hace falta, que consultes con un kinesiólogo/a.</p></div>
      </>,
    },
    { // 6 · Chequeo de realismo
      action: res.ok
        ? <Btn onClick={next}>Continuar</Btn>
        : res.low
          ? <Btn onClick={adjust}>Ajustar mi meta</Btn>
          : <><Btn onClick={() => setWeeks(res.safeWeeks)}>Usar el plazo recomendado</Btn><Btn kind="sec" onClick={adjust}>Ajustar mi meta</Btn></>,
      body: <>
        <h1 className="display h1">Tu meta</h1>
        <p className="sub">Escribila como la pensás: la revisamos en vivo con tu peso actual ({kg(w)} kg).</p>
        <GoalFields weight={w} target={target} weeks={weeks} onTarget={setTarget} onWeeks={setWeeks} />
        <RealismResult res={res} weight={w} />
      </>,
    },
    { // 7 · Tu plan está listo
      action: <><Btn onClick={next}>Empezar gratis</Btn><p className="xs muted note">Sin tarjeta. Nada de lo que hoy es gratis pasa a ser pago.</p></>,
      body: <>
        <span className="badge soft" style={{ alignSelf: 'flex-start' }}>Gratis</span>
        <div className="row" style={{ alignItems: 'flex-end' }} aria-hidden="true">
          {[['descanso', 72], ['comida', 64], ['agua', 56], ['entreno', 58]].map(([f, size], i) => (
            <motion.div key={f} style={{ marginLeft: i ? -8 : 0 }} initial={{ y: 40, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 300, damping: 13 }}>
              <Character forma={f} expr="satisfecho" level={100} size={size} />
            </motion.div>
          ))}
        </div>
        <h1 className="display h1">Tu plan está listo</h1>
        <div className="stack g10">
          {[
            ['entreno', 'Entrenamiento', `${training.days} días por semana, ${training.minutes} min${knee ? ', adaptado a tus rodillas' : ''}`],
            ['comida', 'Proteína mínima', `${n.prot} g por día (1,6 g por kg de tu peso)`],
            ['comida', 'Calorías', `${fmt(n.kcal)} kcal por día: ${n.deficit > 0 ? 'déficit moderado' : n.deficit < 0 ? 'superávit leve' : 'mantenimiento'}, calculado para vos`],
            ['agua', 'Agua y sueño', `${liters(2300)} L de agua y 7 a 9 h de sueño, según tu entrenamiento`],
          ].map(([f, t, d], i) => (
            <motion.div key={t} className="card row g14" style={{ padding: 14 }} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
              <Character forma={f} expr="contento" level={70} size={32} breathe={false} />
              <span className="stack g4"><span className="t15 fw6">{t}</span><span className="small muted">{d}</span></span>
            </motion.div>
          ))}
        </div>
      </>,
    },
    { // 8 · Guardá tu plan
      action: <>
        <Btn onClick={() => { s.notify('Cuenta creada (en el prototipo es simulado)', 'agua'); next() }}>Continuar con Apple</Btn>
        <Btn kind="sec" onClick={() => { s.notify('Cuenta creada (en el prototipo es simulado)', 'agua'); next() }}>Continuar con Google</Btn>
        <Btn kind="sec" onClick={() => { s.notify('Cuenta creada (en el prototipo es simulado)', 'agua'); next() }}><Icon name="mail" size={20} /> Continuar con mail</Btn>
        <button type="button" className="link" style={{ alignSelf: 'center', minHeight: 44 }} onClick={next}>Ahora no</button>
      </>,
      body: <>
        <div className="row center" style={{ alignItems: 'flex-end', marginTop: 24 }} aria-hidden="true">
          {[['descanso', 66], ['comida', 78], ['agua', 66], ['entreno', 68]].map(([f, size], i) => (
            <motion.div key={f} style={{ marginLeft: i ? -6 : 0 }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300, damping: 15 }}>
              <Character forma={f} expr={f === 'comida' ? 'energia' : 'satisfecho'} level={100} size={size} />
            </motion.div>
          ))}
        </div>
        <div className="center-stack">
          <h1 className="display h1">Guardá tu plan</h1>
          <p className="sub">Creá una cuenta para no perder tu progreso si cambiás de teléfono. Es gratis.</p>
          <p className="xs muted mt8">Al continuar aceptás los Términos y la Política de privacidad. Tus datos de salud no se venden ni se comparten.</p>
        </div>
      </>,
    },
    { // 9 · ¿Te avisamos?
      action: <><Btn onClick={() => { s.notify('Avisos activados. Podés cambiarlos cuando quieras.', 'agua'); finish(true) }}>Activar avisos</Btn><Btn kind="sec" onClick={() => finish(false)}>Ahora no</Btn></>,
      body: <>
        <div className="center-stack" style={{ marginTop: 16 }}>
          <Character forma="agua" expr="energia" level={80} size={100} />
          <h1 className="display h1">¿Te avisamos?</h1>
          <p className="sub">Pocos avisos, solo los que te sirven.</p>
        </div>
        <div className="card stack g14">
          {[['agua', 'Cuándo tomar agua, según tu entrenamiento'], ['entreno', 'Tus días de entrenamiento, a tu hora'], ['descanso', 'Cuándo ir a dormir para descansar bien']].map(([f, t], i) => (
            <motion.div key={f} className="row g12" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <span style={{ width: 40, display: 'grid', placeItems: 'center' }}><Character forma={f} expr={f === 'descanso' ? 'dormido' : 'contento'} level={70} size={34} breathe={false} /></span>
              <span className="t15">{t}</span>
            </motion.div>
          ))}
        </div>
        <p className="small muted tc">Podés cambiar o apagar cada aviso cuando quieras. Nunca te mandamos mensajes de culpa.</p>
      </>,
    },
  ]
  const cur = steps[step]

  return (
    <Screen nav={false} className={cur.hero ? 'ob-hero' : ''} action={<AnimatePresence mode="wait" initial={false}><motion.div key={step} className="stack g10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>{cur.action}</motion.div></AnimatePresence>} label="Onboarding">
      <div className="ob-top">
        {step > 0
          ? <motion.button type="button" className="hit" aria-label="Paso anterior" onClick={() => go(step - 1)} whileTap={{ scale: 0.9 }} style={{ marginLeft: -12 }}><Icon name="back" /></motion.button>
          : <span style={{ width: 32 }} />}
        {step < 7 && (
          <div className="ob-bar" role="progressbar" aria-label="Progreso del onboarding" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1}>
            {COLORS.map((c, i) => <span key={i}><motion.i initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} style={{ background: i === 0 && step === 0 ? 'var(--ink)' : c }} /></span>)}
          </div>
        )}
      </div>
      <AnimatePresence mode="wait" custom={dir.current} initial={false}>
        <motion.div key={step} className="stack g16 ob-step" custom={dir.current} variants={stepV} initial="enter" animate="center" exit="exit">
          {cur.body}
        </motion.div>
      </AnimatePresence>
    </Screen>
  )
}
