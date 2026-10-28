import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { APP_NAME } from '../../brand'
import Icon from '../../components/Icons'
import { BodyForm, GOALS, GoalFields, RealismResult, TrainingForm } from '../../components/Forms'
import { Btn, Chip, Row, Screen, Seg, Sheet, Tap, Title, Toggle, TopBar, useBack } from '../../components/ui'
import { fmt, kg } from '../../lib/format'
import { checkGoal, planNumbers } from '../../lib/goal'

export function Inicio() {
  const s = useStore()
  const navigate = useNavigate()
  const [sheet, setSheet] = useState(null)
  const b = s.body
  return (
    <Screen>
      <TopBar back="Hoy" to="/hoy" />
      <header className="row g14">
        <span className="avatar lg" aria-hidden="true">{s.name[0]}</span>
        <div className="stack g4"><h1 className="display h1">{s.name}</h1><p className="small muted">Entrena hace {b.years} años · {s.goal.type}</p></div>
      </header>

      <p className="group-label">Tu plan</p>
      <div className="card list">
        <Row to="/perfil/objetivo" title="Objetivo" desc={`${s.goal.type} · ${s.deficit > 0 ? 'déficit moderado' : s.deficit < 0 ? 'superávit leve' : 'mantenimiento'}`} />
        <Row to="/perfil/cuerpo" title="Datos del cuerpo" desc={`${fmt(b.height / 100, 2)} m · ${s.hideWeight ? 'peso oculto' : `${kg(b.weight)} kg`} · ${b.sex === 'Prefiero no decir' ? 'sin dato de sexo' : b.sex.toLowerCase()}`} />
        <Row to="/perfil/lesiones" title="Molestias y lesiones" desc={s.injuries.length ? s.injuries.map((i) => i.zone).join(', ') : 'Ninguna'} />
        <Row to="/perfil/dias" title="Días y tiempo" desc={`${s.training.days} días · ${s.training.minutes} min · ${s.training.place.split(' ')[0].toLowerCase()}`} />
      </div>

      <p className="group-label">App</p>
      <div className="card list">
        <Row to="/perfil/recordatorios" title="Recordatorios" desc={`${s.reminders.filter((r) => r.on).length} activos · agua, entrenamiento y sueño`} />
        <div className="stack g10" style={{ padding: '14px 0' }}>
          <span className="stack g4"><span className="fw6 t15">Modo oscuro</span><span className="small muted">{s.theme === 'auto' ? 'Según el teléfono' : s.theme === 'dark' ? 'Siempre oscuro' : 'Siempre claro'}</span></span>
          <Seg id="tema" options={[{ value: 'auto', label: 'Auto' }, { value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]} value={s.theme} onChange={(theme) => s.set({ theme })} label="Tema" />
        </div>
        <div className="list-item" style={{ cursor: 'default' }}>
          <span className="grow stack g4"><span className="t">Ocultar números</span><span className="d">Ver solo la tendencia del peso, sin el número</span></span>
          <Toggle on={s.hideWeight} onChange={(x) => s.set({ hideWeight: x })} label="Ocultar números" />
        </div>
        <Row onClick={() => setSheet('unidades')} title="Unidades" desc="kg · cm · kcal" />
      </div>

      <p className="group-label">Cuenta</p>
      <div className="card list">
        <Row to="/perfil/pro" title="Tu plan" desc={s.pro ? 'Pro (prueba de 7 días)' : 'Gratis'} right={<span className="fw6 t14">{s.pro ? 'Ver' : 'Ver Pro'}</span>} chevron={false} />
        <Row to="/perfil/pausa" title="Pausar mi plan" desc={s.paused ? `En pausa ${s.paused.until ? `hasta el ${s.paused.until}` : 'sin fecha'}` : 'Vacaciones, lesión o lo que necesites'} />
        <Row to="/perfil/privacidad" title="Privacidad y datos de salud" />
        <Row onClick={() => setSheet('ayuda')} title="Ayuda y contacto" />
      </div>

      <p className="group-label">Prototipo</p>
      <div className="card list">
        <Row to="/primer-dia" title="Ver el primer día" desc="Personajes vacíos y primeros pasos" />
        <Row to="/sin-conexion" title="Ver sin conexión" />
        <Row to="/avisos" title="Ver los avisos en el teléfono" />
        <Row onClick={() => { s.reset(); navigate('/onboarding', { replace: true }) }} title="Volver a empezar" desc="Borra los datos de ejemplo y abre el onboarding" />
      </div>
      <p className="xs muted tc">{APP_NAME} · prototipo de portfolio</p>

      <Sheet open={sheet === 'unidades'} onClose={() => setSheet(null)} title="Unidades">
        <div className="card list">
          {[['Peso', 'kg'], ['Medidas', 'cm'], ['Energía', 'kcal'], ['Agua', 'litros']].map(([k, v]) => <div key={k} className="list-item" style={{ cursor: 'default' }}><span className="grow t">{k}</span><span className="chip static on ink">{v}</span></div>)}
        </div>
        <p className="small muted">Por ahora usamos el sistema métrico. Libras y onzas llegan más adelante.</p>
        <Btn onClick={() => setSheet(null)}>Listo</Btn>
      </Sheet>
      <Sheet open={sheet === 'ayuda'} onClose={() => setSheet(null)} title="Ayuda y contacto">
        {[['¿Por qué no puedo poner cualquier meta?', 'Porque te cuidamos: nunca proponemos bajar más del 1 % de tu peso por semana. Siempre te mostramos un plazo seguro.'],
          ['¿Pierdo algo si falto un día?', 'No. No hay rachas: lo que hiciste queda y retomás cuando puedas.'],
          ['¿Qué pasa con mis datos?', 'Son datos de salud: no se venden ni se comparten. Podés descargarlos o borrarlos cuando quieras.']].map(([q, a]) => (
          <div key={q} className="stack g4"><p className="t15 fw6">{q}</p><p className="small muted">{a}</p></div>
        ))}
        <Btn kind="sec" onClick={() => { setSheet(null); s.notify('Te respondemos en menos de 24 h', 'agua') }}><Icon name="mail" size={20} /> Escribirnos</Btn>
      </Sheet>
    </Screen>
  )
}

/* Editar objetivo: mismo chequeo de realismo que el onboarding */
export function Objetivo() {
  const s = useStore()
  const back = useBack('/perfil')
  const w = s.body.weight
  const [type, setType] = useState(s.goal.type)
  const [target, setTarget] = useState(s.goal.target)
  const [weeks, setWeeks] = useState(s.goal.weeks)
  const res = checkGoal({ weight: w, height: s.body.height, target, weeks })
  const save = () => {
    const n = planNumbers({ ...s.body, goal: type, days: s.training.days })
    s.set({ goal: { type, target, weeks }, kcalGoal: n.kcal, tdee: n.tdee, deficit: n.deficit, protGoal: n.prot })
    s.notify('Objetivo guardado', 'descanso'); back()
  }
  const other = () => {
    const safe = res.kind === 'lose' && !res.low ? +(w - res.max * weeks).toFixed(0) : Math.max(w - 3, res.minHealthy || 0)
    setTarget(Math.round(safe * 2) / 2)
  }
  const action = res.ok
    ? <Btn onClick={save}>Guardar objetivo</Btn>
    : res.low
      ? <Btn onClick={other}>Elegir otra meta</Btn>
      : <><Btn onClick={() => setWeeks(res.safeWeeks)}>Usar el plazo seguro</Btn><Btn kind="sec" onClick={other}>Elegir otra meta</Btn></>
  return (
    <Screen action={action}>
      <TopBar back="Perfil" to="/perfil" />
      <Title>Tu objetivo</Title>
      <div className="chips">{GOALS.map((g) => <Chip key={g.t} on={type === g.t} tone="training" onClick={() => setType(g.t)}>{g.t}</Chip>)}</div>
      <GoalFields weight={w} target={target} weeks={weeks} onTarget={setTarget} onWeeks={setWeeks} />
      <RealismResult res={res} weight={w} />
      {res.kind === 'lose' && (
        <div className="card stack g8">
          <p className="display h3">¿{kg(res.amount)} kilos de qué?</p>
          <p className="t15">Bajar de peso rápido saca agua, músculo y un poco de grasa. Una pérdida sana baja grasa y cuida el músculo: el peso baja más lento, pero el cambio se ve y se sostiene. Por eso medimos tu avance con cintura, medidas y fuerza, no solo con la balanza.</p>
        </div>
      )}
    </Screen>
  )
}

export function Cuerpo() {
  const s = useStore()
  const back = useBack('/perfil')
  const [v, setV] = useState(s.body)
  const ok = v.height >= 120 && v.height <= 230 && v.weight >= 30 && v.weight <= 250
  const save = () => {
    const n = planNumbers({ ...v, goal: s.goal.type, days: s.training.days })
    s.set({ body: { ...v, weight: +v.weight }, kcalGoal: n.kcal, tdee: n.tdee, deficit: n.deficit, protGoal: n.prot })
    s.notify('Datos guardados. Recalculamos tus números.', 'comida'); back()
  }
  return (
    <Screen action={<Btn onClick={save} disabled={!ok}>Guardar</Btn>}>
      <TopBar back="Perfil" to="/perfil" />
      <Title sub="Los usamos para calcular tu gasto y tus metas. No se comparten.">Datos del cuerpo</Title>
      <BodyForm v={v} onChange={setV} />
    </Screen>
  )
}

export function Dias() {
  const s = useStore()
  const back = useBack('/perfil')
  const [v, setV] = useState(s.training)
  return (
    <Screen action={<Btn onClick={() => { s.set({ training: v, sessionsGoal: v.days }); s.notify('Guardado. Ajustamos tu semana.', 'entreno'); back() }}>Guardar</Btn>}>
      <TopBar back="Perfil" to="/perfil" />
      <Title sub="Con esto armamos la duración y la cantidad de entrenamientos.">Días y tiempo</Title>
      <TrainingForm v={v} onChange={setV} />
    </Screen>
  )
}

/* Molestias y lesiones */
const ZONES = ['Rodilla derecha', 'Rodilla izquierda', 'Hombro', 'Zona lumbar', 'Cadera', 'Muñeca', 'Codo']
const CARE = {
  Rodilla: ['sentadilla profunda, estocadas con salto, extensión de cuádriceps con mucho peso', 'alternativas con la rodilla estable y progresión sin dolor'],
  Hombro: ['press por encima de la cabeza con mucho peso y fondos', 'empujes con agarre neutro y trabajo de espalda alta'],
  'Zona lumbar': ['peso muerto pesado y movimientos con la espalda redondeada', 'ejercicios con apoyo y core para estabilizar'],
  Cadera: ['rangos extremos de cadera y saltos', 'movilidad suave y fuerza de glúteo medio'],
  Muñeca: ['flexiones apoyando la palma y barra con agarre fijo', 'mancuernas con agarre neutro y máquinas'],
  Codo: ['curl y extensiones pesadas', 'tiro con agarre neutro y menos carga en brazos'],
}
export function Lesiones() {
  const s = useStore()
  const [edit, setEdit] = useState(null) // id o 'nueva'
  const [kine, setKine] = useState(false)
  const [note, setNote] = useState(s.kineNote || '')
  const cur = edit === 'nueva' ? { id: `z${Date.now()}`, zone: 'Hombro', level: 'Leve', since: 'Hace poco' } : s.injuries.find((i) => i.id === edit)
  const [draft, setDraft] = useState(null)
  const d = draft || cur
  const open = (id) => { setDraft(null); setEdit(id) }
  const save = () => {
    s.set((st) => ({ injuries: st.injuries.some((i) => i.id === d.id) ? st.injuries.map((i) => (i.id === d.id ? d : i)) : [...st.injuries, d] }))
    setEdit(null); s.notify('Guardado. Adaptamos tus ejercicios.', 'entreno')
  }
  return (
    <Screen>
      <TopBar back="Perfil" to="/perfil" />
      <Title sub="Adaptamos los ejercicios para no cargar estas zonas. No reemplaza a un profesional.">Molestias y lesiones</Title>
      {s.injuries.map((i) => {
        const c = CARE[i.zone.split(' ')[0]] || CARE.Rodilla
        return (
          <div key={i.id} className="card stack g10">
            <div className="row between g8"><h2 className="display h3">{i.zone}</h2><button type="button" className="link" onClick={() => open(i.id)}>Editar</button></div>
            <div className="chips"><span className="chip static on warn">Molestia {i.level.toLowerCase()}</span><span className="chip static">{i.since}</span></div>
            <p className="small muted">Evitamos: {c[0]}.</p>
            <p className="small">Te damos: {c[1]}.</p>
          </div>
        )
      })}
      {s.injuries.length === 0 && <p className="t15 muted">No cargaste molestias. Si aparece alguna, sumala y adaptamos tus ejercicios.</p>}
      <div className="card row between g12">
        <p className="t15 fw6">Avisarme si un ejercicio carga esta zona</p>
        <Toggle on={s.injuryAlert} onChange={(x) => s.set({ injuryAlert: x })} label="Avisarme si un ejercicio carga esta zona" />
      </div>
      <Btn kind="dashed" onClick={() => open('nueva')}>+ Agregar otra zona</Btn>
      <Tap className="card soft tint-water stack g4" onClick={() => setKine(true)}>
        <span className="t15 fw6">¿Tenés indicaciones de tu kinesiólogo/a?</span>
        <span className="small">{s.kineNote ? 'Cargadas: las respetamos por encima de nuestras sugerencias.' : 'Cargalas y las respetamos por encima de nuestras sugerencias.'}</span>
      </Tap>

      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit === 'nueva' ? 'Nueva zona' : 'Editar zona'}>
        {d && <>
          <div className="chips">{ZONES.map((z) => <Chip key={z} on={d.zone === z} tone="warn" onClick={() => setDraft({ ...d, zone: z })}>{z}</Chip>)}</div>
          <Seg id="lesion-nivel" options={['Leve', 'Moderada', 'Fuerte']} value={d.level} onChange={(level) => setDraft({ ...d, level })} label="Intensidad" />
          <div className="chips">{['Hace poco', 'Hace 3 meses', 'Hace más de un año'].map((x) => <Chip key={x} on={d.since === x} onClick={() => setDraft({ ...d, since: x })}>{x}</Chip>)}</div>
          {d.level === 'Fuerte' && <div className="notice tint-warn"><p>Con dolor fuerte, consultá con un profesional antes de entrenar esa zona. La app sugiere alternativas, no diagnostica.</p></div>}
          <Btn onClick={save}>Guardar</Btn>
          {edit !== 'nueva' && <button type="button" className="link warn" style={{ alignSelf: 'center', minHeight: 44 }} onClick={() => { s.set((st) => ({ injuries: st.injuries.filter((x) => x.id !== d.id) })); setEdit(null) }}>Ya no me molesta</button>}
        </>}
      </Sheet>
      <Sheet open={kine} onClose={() => setKine(false)} title="Indicaciones de tu kinesiólogo/a">
        <textarea className="note-in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej.: nada de impacto por 4 semanas; sentadilla solo hasta 90°." aria-label="Indicaciones" />
        <Btn onClick={() => { s.set({ kineNote: note }); setKine(false); s.notify('Indicaciones guardadas', 'entreno') }}>Guardar indicaciones</Btn>
      </Sheet>
    </Screen>
  )
}
