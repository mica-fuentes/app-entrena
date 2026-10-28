import { useStore } from '../../store'
import Character from '../../components/Character'
import { Btn, Screen, TopBar, useBack } from '../../components/ui'
import { hours } from '../../lib/format'

export default function PorQue() {
  const s = useStore()
  const back = useBack('/hoy')
  const apply = () => {
    s.set({ planAdjusted: true, adviceClosed: false })
    s.notify('Ajuste aplicado: hoy una serie menos.', 'entreno')
    back()
  }
  const keep = () => {
    s.set({ planAdjusted: false, adviceClosed: true })
    s.notify('Listo: hoy seguís con tu plan de siempre.', 'descanso')
    back()
  }
  const reasons = [
    { forma: 'descanso', expr: 'dormido', t: `Dormiste ${hours(s.sleep)} (tu promedio es 7 h).` },
    { forma: 'entreno', expr: 'cansado', t: 'Ayer hiciste piernas con mucho volumen.' },
    { forma: 'agua', expr: 'contento', t: 'Vas bien con el agua: eso ayuda.' },
  ]
  return (
    <Screen action={<><Btn onClick={apply}>Aplicar ajuste</Btn><Btn kind="sec" onClick={keep}>Mantener mi plan</Btn></>}>
      <TopBar back="Hoy" to="/hoy" />
      <h1 className="display h1">Hoy, más tranqui. Te contamos por qué</h1>
      <ul className="card list" style={{ listStyle: 'none', margin: 0 }}>
        {reasons.map((r) => (
          <li key={r.t} className="row g14" style={{ padding: '12px 0' }}>
            <span style={{ width: 44, display: 'grid', placeItems: 'center' }}><Character forma={r.forma} expr={r.expr} level={r.forma === 'agua' ? 65 : 45} size={r.forma === 'descanso' ? 42 : 36} /></span>
            <span className="t15">{r.t}</span>
          </li>
        ))}
      </ul>
      <div className="card soft tint-hero stack g8">
        <p className="t15 fw6">Qué cambia</p>
        <ul className="t15 stack g4" style={{ margin: 0, paddingLeft: 20 }}>
          <li>Una serie menos por ejercicio (de 4 a 3).</li>
          <li>Mismo peso: no perdés fuerza.</li>
          <li>Mañana volvés a tu volumen normal.</li>
        </ul>
      </div>
      <p className="small muted">El descanso es parte del entrenamiento: el músculo crece cuando te recuperás. Vos decidís.</p>
    </Screen>
  )
}
