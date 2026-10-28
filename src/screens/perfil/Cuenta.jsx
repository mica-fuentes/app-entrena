import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { APP_NAME } from '../../brand'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { StatusBar } from '../../components/Shell'
import { Btn, Chip, Row, Screen, Sheet, Tap, Title, Toggle, TopBar, useBack } from '../../components/ui'
import { daysAgo, MONTHS } from '../../lib/format'

const FEATURES = [
  ['Plan, rutinas y biblioteca', true],
  ['Mapa de músculos y alternativas', true],
  ['Comida con buscador y escáner', true],
  ['Agua, sueño y progreso', true],
  ['Foto del plato con IA', false],
  ['Ajuste automático semanal', false],
  ['Análisis avanzado', false],
]

export function Pro() {
  const s = useStore()
  const back = useBack('/perfil')
  const action = s.pro
    ? <><Btn kind="sec" onClick={() => { s.set({ pro: false }); s.notify('Volviste a Gratis. No perdés nada.', 'agua') }}>Volver a Gratis</Btn><p className="xs muted note">Compromiso: nada de lo que hoy es gratis pasa a ser pago.</p></>
    : <><Btn onClick={() => { s.set({ pro: true }); s.notify('Probás Pro 7 días. Sin tarjeta.', 'agua'); back() }}>Probar 7 días gratis, sin tarjeta</Btn><Btn kind="sec" onClick={back}>Seguir con Gratis</Btn><p className="xs muted note">Compromiso: nada de lo que hoy es gratis pasa a ser pago.</p></>
  return (
    <Screen action={action}>
      <header className="bleed-top cobalt stack g10" style={{ paddingBottom: 18 }}>
        <StatusBar clear />
        <TopBar back="Perfil" to="/perfil" light />
        <h1 className="display h1">Pro, solo si lo necesitás</h1>
        <p className="t15" style={{ opacity: 0.92 }}>Todo lo esencial es gratis y sigue siéndolo. Pro suma lo que nos cuesta mantener.</p>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          {[['comida', 54], ['entreno', 52], ['agua', 50]].map(([f, size], i) => (
            <motion.div key={f} style={{ marginLeft: i ? -6 : 0 }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 320, damping: 16 }}>
              <Character forma={f} expr="satisfecho" level={80} size={size} />
            </motion.div>
          ))}
        </div>
      </header>
      {s.pro && <div className="notice tint-training"><p><b>Pro activo.</b> Te quedan 7 días de prueba. Te avisamos antes de que termine: no se cobra nada solo.</p></div>}
      <div className="card" style={{ padding: '4px 16px' }}>
        <div className="pro-table" role="table" aria-label="Gratis y Pro">
          <span /><span className="xs muted c">Gratis</span><span className="xs muted c">Pro</span>
          {FEATURES.map(([f, free]) => [
            <span key={f} className="t14">{f}</span>,
            <span key={`${f}g`} className="c" aria-label={free ? 'Incluido gratis' : 'No incluido gratis'}>{free ? <Icon name="check" size={16} stroke={2.2} /> : <span className="muted">—</span>}</span>,
            <span key={`${f}p`} className="c" aria-label="Incluido en Pro"><Icon name="check" size={16} stroke={2.2} /></span>,
          ])}
        </div>
      </div>
      <div className="card soft tint-training stack g4">
        <p className="display h2">$ X.XXX por mes</p>
        <p className="small">Precio a definir · o $ XX.XXX por año</p>
      </div>
    </Screen>
  )
}

export function Privacidad() {
  const s = useStore()
  const navigate = useNavigate()
  const [sheet, setSheet] = useState(null)
  const p = s.privacy
  const setP = (k) => (v) => s.set((st) => ({ privacy: { ...st.privacy, [k]: v } }))
  const download = () => {
    let data = {}
    try { data = JSON.parse(localStorage.getItem('app-entrena-v2') || '{}') } catch { /* nada */ }
    const blob = new Blob([JSON.stringify({ app: APP_NAME, exportado: new Date().toISOString(), datos: data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mis-datos.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    s.notify('Descargamos tus datos', 'agua')
  }
  const end = daysAgo(-30)
  return (
    <Screen>
      <TopBar back="Perfil" to="/perfil" />
      <Title>Tus datos son tuyos</Title>
      <div className="notice tint-rest"><p>Peso, medidas, fotos, lesiones y sueño son datos de salud: los tratamos como datos sensibles según la Ley 25.326 de Protección de Datos Personales.</p></div>
      <div className="card list">
        <div className="list-item" style={{ cursor: 'default' }}>
          <span className="grow stack g4"><span className="t">Usar mis datos para mejorar la app</span><span className="d">Siempre anónimos. Lo podés cambiar cuando quieras.</span></span>
          <Toggle on={p.improve} onChange={setP('improve')} label="Usar mis datos para mejorar la app" />
        </div>
        <div className="list-item" style={{ cursor: 'default' }}>
          <span className="grow stack g4"><span className="t">Fotos de progreso solo en este teléfono</span><span className="d">No se suben a la nube.</span></span>
          <Toggle on={p.photosLocal} onChange={setP('photosLocal')} label="Fotos de progreso solo en este teléfono" />
        </div>
      </div>
      <div className="card list">
        <Row onClick={download} title="Descargar mis datos" desc="Un archivo con todo lo que cargaste" right={<Icon name="download" size={20} />} chevron={false} />
        <Row onClick={() => setSheet('ver')} title="Ver qué datos guardamos" />
      </div>
      <Tap className="card soft tint-warn stack g4" onClick={() => setSheet('borrar')}>
        <span className="t15 fw6 warn-title">Borrar mi cuenta</span>
        <span className="small">Se borran todos tus datos en 30 días. No se puede deshacer.</span>
      </Tap>

      <Sheet open={sheet === 'ver'} onClose={() => setSheet(null)} title="Qué datos guardamos">
        {[['Tu cuerpo', 'Altura, peso, fecha de nacimiento y sexo para el cálculo.'], ['Tu entrenamiento', 'Rutinas, series, pesos y molestias.'], ['Tu comida', 'Lo que cargás y tus alimentos creados.'], ['Descanso y agua', 'Horas de sueño, calidad y vasos de agua.'], ['Fotos', p.photosLocal ? 'Solo en este teléfono.' : 'En tu cuenta, cifradas.']].map(([k, v]) => (
          <div key={k} className="stack g4"><p className="t15 fw6">{k}</p><p className="small muted">{v}</p></div>
        ))}
        <p className="small muted">Nunca vendemos ni compartimos tus datos.</p>
        <Btn onClick={() => setSheet(null)}>Entendido</Btn>
      </Sheet>
      <Sheet open={sheet === 'borrar'} onClose={() => setSheet(null)} title="¿Borramos tu cuenta?">
        <p className="t15 muted">Vamos a borrar todos tus datos el {end.getDate()} de {MONTHS[end.getMonth()]}. Hasta ese día podés arrepentirte entrando de nuevo. Si querés, antes descargá tus datos.</p>
        <Btn onClick={() => { setSheet(null); s.reset(); navigate('/onboarding', { replace: true }) }}>Sí, borrar mi cuenta</Btn>
        <Btn kind="sec" onClick={() => setSheet(null)}>Cancelar</Btn>
      </Sheet>
    </Screen>
  )
}

const REASONS = ['Me voy de vacaciones', 'No me siento bien', 'Tengo una lesión', 'Otra razón']
export function Pausa() {
  const s = useStore()
  const navigate = useNavigate()
  const [why, setWhy] = useState(REASONS[0])
  const [len, setLen] = useState('1 semana')
  const pause = () => {
    const d = daysAgo(len === '1 semana' ? -7 : -14)
    s.set({ paused: { reason: why, until: len === 'Sin fecha' ? null : `${d.getDate()} de ${MONTHS[d.getMonth()]}` } })
    s.notify('Pausamos metas y avisos. No perdés nada.', 'descanso')
    navigate('/hoy')
  }
  return (
    <Screen action={s.paused
      ? <Btn onClick={() => { s.set({ paused: null }); s.notify('¡Qué bueno verte! Retomamos de a poco.', 'descanso'); navigate('/hoy') }}>Volver ahora</Btn>
      : <Btn onClick={pause}>Pausar</Btn>}>
      <TopBar back="Perfil" to="/perfil" />
      <div className="center-stack">
        <Character forma="descanso" expr="satisfecho" level={85} size={104} label="Luna tranquila" />
        <h1 className="display h1 mt8">¿Necesitás una pausa?</h1>
        <p className="sub">Pausamos metas y recordatorios. No perdés nada y volvés cuando quieras.</p>
      </div>
      {s.paused
        ? <div className="notice tint-rest"><p>Estás en pausa {s.paused.until ? `hasta el ${s.paused.until}` : 'sin fecha'} ({s.paused.reason.toLowerCase()}).</p></div>
        : <>
          <div className="stack g8" role="radiogroup" aria-label="Motivo">
            {REASONS.map((r) => <Tap key={r} className={`opt lime${why === r ? ' on' : ''}`} role="radio" aria-checked={why === r} onClick={() => setWhy(r)}><span className="t">{r}</span></Tap>)}
          </div>
          {why === 'Tengo una lesión' && <div className="notice tint-hero"><p>Antes de volver, consultá con un profesional. Cuando retomes, adaptamos los ejercicios a la zona.</p></div>}
          <div className="row g8 wrap"><span className="small muted">Hasta:</span>{['1 semana', '2 semanas', 'Sin fecha'].map((x) => <Chip key={x} on={len === x} tone="rest" onClick={() => setLen(x)}>{x}</Chip>)}</div>
        </>}
    </Screen>
  )
}
