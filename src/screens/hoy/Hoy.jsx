import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { APP_NAME } from '../../brand'
import Character from '../../components/Character'
import { Btn, Collapse, Num, Screen, SectionHead, Tap } from '../../components/ui'
import { DAYS, hours, liters, longDate, weekday } from '../../lib/format'

function DayCard({ tone, forma, expr, level, value, desc, to, onClick, label, action, size = 50 }) {
  return (
    <div className={`daycard tint-${tone}`}>
      <Tap to={to} onClick={onClick} className="daycard-main" aria-label={label}>
        <Character forma={forma} expr={expr} level={level} size={size} />
        <span className="stack g4 mt4">
          {value}
          <span className="small daycard-desc">{desc}</span>
        </span>
      </Tap>
      {action}
    </div>
  )
}

export default function Hoy() {
  const s = useStore()
  const navigate = useNavigate()
  const today = weekday()
  const day = s.routine.plan[0]
  const showAdvice = s.sleepLogged && s.sleep < 6 && !s.adviceClosed && !s.paused
  const doneToday = s.weekDone.includes(today)
  const adjusted = s.planAdjusted && s.sleepLogged && s.sleep < 6
  const keepPlan = () => {
    s.set({ adviceClosed: true, planAdjusted: false })
    s.notify('Listo: hoy seguís con tu plan de siempre.', 'descanso')
  }
  const start = () => { s.startWorkout(0); navigate('/entrenar/en-curso') }
  const knee = s.injuries.some((i) => i.zone.toLowerCase().includes('rodilla'))

  return (
    <Screen label={`${APP_NAME}: Hoy`}>
      <header className="row between g12">
        <div className="stack g4">
          <p className="small muted">{longDate()}</p>
          <h1 className="display h1">Hola, {s.name}</h1>
        </div>
        <Link to="/perfil" className="avatar" aria-label="Tu perfil">{s.name[0]}</Link>
      </header>

      {s.paused && (
        <div className="notice tint-rest">
          <Character forma="descanso" expr="satisfecho" level={70} size={48} />
          <div className="stack g6 grow">
            <p className="t">Estás en pausa {s.paused.until ? `hasta el ${s.paused.until}` : 'sin fecha'}</p>
            <p>Metas y avisos en pausa. No perdés nada de lo que hiciste.</p>
            <div><button type="button" className="link" onClick={() => { s.set({ paused: null }); s.notify('¡Qué bueno verte! Retomamos de a poco.', 'descanso') }}>Volver ahora</button></div>
          </div>
        </div>
      )}

      <Collapse show={showAdvice}>
        <div className="notice tint-hero">
          <Character forma="descanso" expr="dormido" level={45} size={58} />
          <div className="stack g4 grow">
            <h2 className="display h3">Hoy, más tranqui</h2>
            <p>Dormiste {hours(s.sleep)}: {adjusted ? 'hacemos una serie menos por ejercicio.' : 'si querés, hacemos una serie menos por ejercicio.'}</p>
            <div className="row wrap" style={{ columnGap: 16, rowGap: 0 }}>
              <Link to="/por-que" className="link">Ver por qué</Link>
              <button type="button" className="link" onClick={keepPlan}>Mantener mi plan</button>
            </div>
          </div>
        </div>
      </Collapse>

      <SectionHead title="Tu día"><span className="small muted">Tocá para registrar</span></SectionHead>
      <div className="grid2 daygrid">
        <DayCard
          tone="training" forma="entreno" expr="contento" level={(s.sessions / s.sessionsGoal) * 100}
          to="/entrenar" label={`Entreno: ${s.sessions} de ${s.sessionsGoal} entrenamientos esta semana`}
          value={<span className="num h2 daycard-num"><Num value={s.sessions} /> de {s.sessionsGoal}</span>}
          desc="entrenamientos esta semana" size={46}
        />
        <DayCard
          tone="food" forma="comida" expr={s.prot >= s.protGoal ? 'satisfecho' : 'contento'} level={(s.prot / s.protGoal) * 100}
          to="/comida" label={`Comida: ${s.prot} de ${s.protGoal} gramos de proteína`}
          value={<span className="num h2 daycard-num"><Num value={s.prot} /> g</span>}
          desc={`de ${s.protGoal} g de proteína`}
          action={<Btn kind="sm white" className="daycard-act" to="/comida/buscar">+ Comida</Btn>}
        />
        <DayCard
          tone="water" forma="agua" expr={s.water >= s.waterGoal ? 'satisfecho' : 'contento'} level={(s.water / s.waterGoal) * 100}
          onClick={() => s.setSheet('agua')} label={`Agua: ${liters(s.water)} de ${liters(s.waterGoal)} litros`}
          value={<span className="num h2 daycard-num"><Num value={s.water} format={(v) => `${liters(v)} L`} /></span>}
          desc={`de ${liters(s.waterGoal)} L`} size={44}
          action={<Btn kind="sm white" className="daycard-act" onClick={() => s.addWater(250)} aria-label="Sumar 250 mililitros de agua">+ 250 ml</Btn>}
        />
        <DayCard
          tone="rest" forma="descanso" expr={!s.sleepLogged ? 'contento' : s.sleep < 6 ? 'dormido' : s.sleep >= 7 ? 'satisfecho' : 'contento'} level={s.sleepLogged ? (s.sleep / s.sleepGoal) * 100 : 0}
          to="/sueno" label={s.sleepLogged ? `Descanso: dormiste ${hours(s.sleep)}` : 'Descanso: todavía no registraste cuánto dormiste'}
          value={<span className="num h2 daycard-num">{s.sleepLogged ? <Num value={s.sleep} format={hours} /> : '—'}</span>}
          desc={s.sleepLogged ? 'dormiste · meta 7 a 9 h' : 'contanos cuánto dormiste'} size={52}
          action={<Btn kind="sm white" className="daycard-act" to="/sueno">Registrar</Btn>}
        />
      </div>

      <section className="card soft grad today-card" aria-label="Entrenamiento de hoy">
        <div className="row between g12" style={{ alignItems: 'flex-start' }}>
          <div className="stack g8 grow">
            <p className="label" style={{ opacity: 0.9 }}>{doneToday ? 'Hecho por hoy' : 'Entrenamiento de hoy'}</p>
            <h2 className="display today-title">{s.routine.titles[0]}</h2>
            <p className="small" style={{ opacity: 0.92 }}>
              {day.length} ejercicios · {s.training.minutes} min{knee ? ' · cuidando tus rodillas' : ''}{adjusted ? ' · una serie menos' : ''}
            </p>
          </div>
          <Character forma="entreno" expr={doneToday ? 'satisfecho' : 'energia'} level={doneToday ? 100 : 60} size={72} />
        </div>
        {doneToday
          ? <Btn kind="white" className="mt12" to="/entrenar/historial">Ver tu entrenamiento</Btn>
          : <Btn kind="white" className="mt12" onClick={start}>{s.session ? 'Seguir entrenando' : 'Empezar'}</Btn>}
      </section>

      <section className="stack g12" aria-label="Esta semana">
        <SectionHead title="Esta semana"><span className="small muted">{s.sessions} de {s.sessionsGoal} entrenamientos</span></SectionHead>
        <div className="week">
          {DAYS.map((d, i) => {
            const done = s.weekDone.includes(i)
            const plan = !done && s.routine.days.includes(i) && i >= today
            const cls = `daydot${done ? ' done' : plan ? ' plan' : ''}${i === today ? ' today' : ''}`
            const what = done ? 'entrenaste' : plan ? 'planificado' : 'libre'
            return <span key={i} className={cls} aria-label={`${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i]}: ${what}${i === today ? ', hoy' : ''}`}>{d}</span>
          })}
        </div>
      </section>
    </Screen>
  )
}
