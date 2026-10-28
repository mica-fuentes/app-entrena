import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store'
import { EXERCISES, LIBRARY_ORDER } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Bar, Btn, Num, Row, Screen, SectionHead, Tap, Thumb, Title, TopBar } from '../../components/ui'
import { coverage } from '../../lib/coverage'
import { daysLabel } from '../../lib/format'

/* Entrenar · inicio */
export function Inicio() {
  const s = useStore()
  const r = s.routine
  const months = s.history.filter((h) => new Date(h.date).getMonth() === new Date().getMonth()).length
  return (
    <Screen>
      <Title>Entrenar</Title>

      <section className="card soft tint-training stack g12" style={{ padding: 20 }} aria-label="Tu rutina activa">
        <div className="row between g12" style={{ alignItems: 'flex-start' }}>
          <div className="stack g6">
            <p className="label">Tu rutina activa</p>
            <h2 className="display h2">{r.name}</h2>
            <p className="small">{r.days.length} días · Día 1 de hoy: {r.titles[0].toLowerCase()}</p>
          </div>
          <Character forma="entreno" expr="contento" level={(s.sessions / s.sessionsGoal) * 100} size={62} />
        </div>
        {s.session
          ? <Btn to="/entrenar/en-curso">Seguir entrenando</Btn>
          : <Btn to="/entrenar/dia/0">Empezar día 1</Btn>}
      </section>

      <SectionHead title="Mis rutinas"><Tap to="/entrenar/armar?nueva=1" className="link">+ Nueva</Tap></SectionHead>
      <div className="card list">
        {s.routines.map((x) => (
          <Row key={x.id} to={`/entrenar/rutina?id=${x.id}`}
            left={<Thumb src={x.img} alt="" size={56} />}
            title={<>{x.name}{x.id === s.activeRoutine && <span className="tag training" style={{ marginLeft: 8 }}>Activa</span>}</>}
            desc={`${x.by} · ${coverage(x.plan).pct}% completa`} />
        ))}
      </div>

      <SectionHead title="Explorar" />
      <div className="grid2">
        <Tap to="/entrenar/ejercicios" className="card soft tint-water stack g6 explore">
          <span className="display h3">Ejercicios</span>
          <span className="small">{LIBRARY_ORDER.length} con video y alternativas</span>
        </Tap>
        <Tap to="/entrenar/listas" className="card soft tint-rest stack g6 explore">
          <span className="display h3">Rutinas listas</span>
          <span className="small">Por objetivo y días</span>
        </Tap>
      </div>

      <div className="card list">
        <Row to="/entrenar/historial" left={<span className="qa-ico tint-primary"><Icon name="history" /></span>} title="Historial" desc={`${months} entrenamientos este mes`} />
        <Row to="/entrenar/progreso/hip" state={{ from: 'Entrenar' }} left={<span className="qa-ico tint-training"><Icon name="progreso" /></span>} title="Progreso por ejercicio" desc="Hip thrust: de 50 a 62,5 kg" />
      </div>
    </Screen>
  )
}

/* Tu rutina: qué tan completa está */
export function Cobertura() {
  const s = useStore()
  const [q] = useSearchParams()
  const r = s.routines.find((x) => x.id === q.get('id')) || s.routine
  const cov = coverage(r.plan)
  const active = r.id === s.activeRoutine
  const knee = s.injuries.some((i) => i.zone.toLowerCase().includes('rodilla'))
  const n = Math.min(2, cov.missing.length)
  const action = !active
    ? <Btn onClick={() => { s.set({ activeRoutine: r.id }); s.notify(`"${r.name}" es tu rutina activa`, 'entreno') }}>Usar esta rutina</Btn>
    : cov.missing.length
      ? <><Btn to={`/entrenar/agregar?para=rutina&id=${r.id}`}>Completar con {n} ejercicio{n > 1 ? 's' : ''}</Btn>{knee && <p className="small muted note">Sugerimos opciones que no cargan las rodillas.</p>}</>
      : null
  return (
    <Screen action={action}>
      <TopBar back="Entrenar" to="/entrenar" right={<Tap to={`/entrenar/armar?id=${r.id}`} className="link">Editar</Tap>} />
      <Title sub={`${r.by} · ${r.days.length} días por semana`}>{active ? 'Tu rutina' : r.name}</Title>

      <div className="card row g16">
        <Character forma="entreno" expr={cov.pct >= 90 ? 'satisfecho' : 'contento'} level={cov.pct} size={64} />
        <div className="stack g6 grow">
          <p className="display h3">{cov.label} · <Num value={cov.pct} />%</p>
          <p className="small muted">{cov.text}</p>
          <Bar value={cov.pct} color="var(--rest)" label="Cobertura de la rutina" />
        </div>
      </div>

      <div className="stack g4">
        <h2 className="display h3">Series por músculo esta semana</h2>
        <p className="xs muted">La franja clara es la referencia general: 10 a 20 series.</p>
      </div>
      <div className="card stack g16">
        {cov.rows.map((m, i) => {
          const low = m.status !== 'Bien' && m.status !== 'Mucho'
          return (
            <div key={m.name} className="stack g8">
              <div className="row between g8">
                <span className="t15 fw6">{m.name}</span>
                <span className={`small row g6 ${low ? 'warn-title fw6' : 'muted'}`}>
                  <i className="dot-s" style={{ background: low ? 'var(--caution)' : 'var(--rest)' }} />
                  {m.sets} series · {m.status}
                </span>
              </div>
              <Bar value={m.sets} max={24} color={low ? 'var(--caution)' : 'var(--rest)'} band={[(10 / 24) * 100, (20 / 24) * 100]} delay={0.1 + i * 0.06} label={`${m.name}: ${m.sets} series`} />
            </div>
          )
        })}
      </div>

      <SectionHead title="Días" />
      <div className="card list">
        {r.plan.map((d, i) => (
          <Row key={i} to={`/entrenar/dia/${i}?id=${r.id}`} title={`Día ${i + 1} · ${r.titles[i] || 'Sin nombre'}`} desc={`${d.length} ejercicios · ${daysLabel([r.days[i] ?? i])}`} />
        ))}
      </div>
    </Screen>
  )
}

/* Día de rutina */
export function Dia() {
  const s = useStore()
  const navigate = useNavigate()
  const { n } = useParams()
  const [q] = useSearchParams()
  const r = s.routines.find((x) => x.id === q.get('id')) || s.routine
  const i = Math.min(+n || 0, r.plan.length - 1)
  const day = r.plan[i]
  const knee = s.injuries.some((x) => x.zone.toLowerCase().includes('rodilla'))
  const adjusted = s.planAdjusted && s.sleepLogged && s.sleep < 6
  const start = () => { s.startWorkout(i); navigate('/entrenar/en-curso') }
  const isActive = r.id === s.activeRoutine
  return (
    <Screen action={isActive ? <Btn onClick={start}>{s.session?.day === i ? 'Seguir entrenando' : 'Empezar'}</Btn> : null}>
      <TopBar back="Tu rutina" to="/entrenar/rutina" />
      <h1 className="display h1">Día {i + 1} · {r.titles[i]}</h1>
      <div className="chips">
        <span className="chip static">{day.length} ejercicios</span>
        <span className="chip static">{s.training.minutes} min</span>
        {knee && <span className="chip static on rest">Cuida la rodilla</span>}
        {adjusted && <span className="chip static on training">Una serie menos</span>}
      </div>
      <div className="notice tint-rest" style={{ alignItems: 'center' }}>
        <Character forma="entreno" expr="contento" level={30} size={40} />
        <div className="stack g4"><p className="t">Entrada en calor · 5 min</p><p>Bici o caminata y movilidad de cadera.</p></div>
      </div>
      <div className="card list">
        {day.map((p) => {
          const ex = EXERCISES[p.id]
          const sets = adjusted ? Math.max(2, p.sets - 1) : p.sets
          return <Row key={p.id} to={`/entrenar/ejercicio/${p.id}`} state={{ from: `Día ${i + 1}` }} left={<Thumb src={ex.img} alt="" size={56} />} title={ex.name} desc={`${sets} × ${p.reps} · ${p.rest} s`} />
        })}
      </div>
    </Screen>
  )
}
