import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import Character from '../../components/Character'
import { StatusBar } from '../../components/Shell'
import { Btn, Screen, SectionHead, Tap, TopBar, useBack } from '../../components/ui'
import { DAY_NAMES, MONTHS, liters } from '../../lib/format'
import Icon from '../../components/Icons'

/* Primer día: personajes vacíos y primeros pasos */
export function PrimerDia() {
  const s = useStore()
  const navigate = useNavigate()
  const f = s.firstSteps
  const done = [f.food, f.water, f.workout].filter(Boolean).length
  const steps = [
    { k: 'food', t: 'Cargá tu primera comida', d: 'Tarda menos de 30 segundos', on: () => navigate('/comida/buscar') },
    { k: 'water', t: 'Registrá un vaso de agua', d: 'Tocá al personaje de agua', on: () => s.addWater(250) },
    { k: 'workout', t: 'Hacé el día 1 de tu rutina', d: `${s.routine.titles[0]} · ${s.training.minutes} min`, on: () => navigate('/entrenar/dia/0') },
  ]
  const lv = (k) => (f[k] ? 70 : 25)
  return (
    <Screen action={<Btn kind={done === 3 ? '' : 'sec'} to="/hoy" replace>{done === 3 ? '¡Listo! Ir a Hoy' : 'Ir a Hoy'}</Btn>}>
      <header className="bleed-top tint-hero stack g12" style={{ paddingBottom: 24 }}>
        <p className="small fw6">Día 1</p>
        <h1 className="display h1">Hoy arrancamos de a poco.</h1>
        <p className="t15">Tus personajes están vacíos: se van llenando con lo que hagas hoy.</p>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <Character forma="descanso" expr="contento" level={25} size={70} />
          <Character forma="comida" expr="contento" level={lv('food')} size={76} />
          <Tap className="hit" style={{ width: 'auto', height: 'auto' }} onClick={() => s.addWater(250)} aria-label="Sumar un vaso de agua">
            <Character forma="agua" expr={f.water ? 'energia' : 'contento'} level={lv('water')} size={66} />
          </Tap>
          <Character forma="entreno" expr="contento" level={lv('workout')} size={64} />
        </div>
      </header>
      <SectionHead title="Primeros pasos"><span className="small muted">{done} de 3</span></SectionHead>
      {steps.map((x) => (
        <Tap key={x.k} className="card row g14" style={{ padding: 16 }} onClick={x.on} aria-pressed={f[x.k]}>
          <motion.span className={`round-check${f[x.k] ? ' on' : ''}`} animate={f[x.k] ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.35 }}><Icon name="check" size={18} stroke={2.4} /></motion.span>
          <span className="stack g4 grow"><span className="t15 fw6" style={{ textDecoration: f[x.k] ? 'line-through' : 'none', textDecorationThickness: 1.5 }}>{x.t}</span><span className="small muted">{f[x.k] ? '¡Hecho!' : x.d}</span></span>
          <Icon name="chevron" size={18} style={{ color: 'var(--muted)' }} />
        </Tap>
      ))}
      {done === 3 && <motion.div className="notice tint-rest" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Character forma="comida" expr="satisfecho" level={90} size={40} /><p>Primer día completo. Mañana seguimos, sin apuro.</p></motion.div>}
    </Screen>
  )
}

/* Sin conexión: gota contenta, nunca bloquea */
export function SinConexion() {
  const s = useStore()
  const back = useBack('/hoy')
  const navigate = useNavigate()
  const [trying, setTrying] = useState(false)
  const retry = () => { setTrying(true); setTimeout(() => { setTrying(false); s.notify('Volvió la conexión. Sincronizamos todo.', 'agua'); navigate('/hoy', { replace: true }) }, 1400) }
  return (
    <Screen nav={false} action={<><Btn onClick={back}>Seguir sin conexión</Btn><Btn kind="sec" onClick={retry} disabled={trying}>{trying ? 'Buscando señal…' : 'Reintentar'}</Btn></>}>
      <TopBar back="Atrás" to="/hoy" />
      <div className="center-stack" style={{ marginTop: 'clamp(20px, 12cqi, 80px)' }}>
        <motion.div animate={trying ? { rotate: [0, -6, 6, 0] } : { y: [0, -6, 0] }} transition={{ duration: trying ? 0.6 : 3, repeat: Infinity }}>
          <Character forma="agua" expr="contento" level={40} size={112} label="Gota contenta" />
        </motion.div>
        <h1 className="display h1">Sin conexión</h1>
        <p className="sub">Podés seguir: guardamos todo en el teléfono y lo sincronizamos cuando vuelva internet.</p>
      </div>
    </Screen>
  )
}

/* Avisos en la pantalla bloqueada */
export function Avisos() {
  const s = useStore()
  const navigate = useNavigate()
  const back = useBack('/perfil')
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 10000); return () => clearInterval(t) }, [])
  const left = Math.max(0, s.waterGoal - s.water)
  const list = [
    { f: 'agua', e: 'contento', t: 'Un vaso de agua y seguís', d: `Te faltan ${liters(left)} L para tu meta de hoy.`, w: 'ahora', go: () => { navigate('/hoy'); setTimeout(() => s.setSheet('agua'), 350) } },
    { f: 'descanso', e: 'dormido', t: 'Hoy, más tranqui', d: 'Dormiste poco: ajustamos tu entrenamiento. Tocá para ver.', w: '8:05', go: () => navigate('/por-que') },
    { f: 'entreno', e: 'energia', t: 'Día de piernas', d: 'Hip thrust: la vez pasada 60 kg. ¿Probás 62,5?', w: 'ayer', go: () => navigate('/entrenar/dia/0') },
  ]
  return (
    <Screen nav={false} className="lock-screen" label="Avisos en la pantalla bloqueada">
      <StatusBar clear />
      <div className="center-stack" style={{ color: '#fff', marginTop: 28 }}>
        <p className="t15">{DAY_NAMES[(now.getDay() + 6) % 7]} {now.getDate()} de {MONTHS[now.getMonth()]}</p>
        <p className="num" style={{ fontSize: 'clamp(72px, 24cqi, 96px)', lineHeight: 1 }}>{now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}</p>
      </div>
      <div className="stack g10" style={{ marginTop: 'auto' }}>
        {list.map((n, i) => (
          <motion.div key={n.t} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 260, damping: 24 }}>
            <Tap className="notif w100" onClick={n.go} style={{ border: 0, textAlign: 'left' }}>
              <Character forma={n.f} expr={n.e} level={60} size={38} breathe={false} />
              <span className="stack g4 grow"><span className="row between g8"><span className="fw6 t15">{n.t}</span><span className="xs" style={{ color: '#5E6272' }}>{n.w}</span></span><span className="small">{n.d}</span></span>
            </Tap>
          </motion.div>
        ))}
        <p className="xs tc" style={{ color: 'rgba(255,255,255,.75)' }}>Tocá un aviso para abrirlo. Nunca mandamos mensajes de culpa.</p>
        <button type="button" className="link" style={{ alignSelf: 'center', color: '#fff', minHeight: 44 }} onClick={back}>Volver</button>
      </div>
    </Screen>
  )
}
