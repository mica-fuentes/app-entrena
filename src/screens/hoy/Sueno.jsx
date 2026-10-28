import { useState } from 'react'
import { useStore } from '../../store'
import Character from '../../components/Character'
import { Btn, Chip, Collapse, Screen, Stepper, TopBar, useBack } from '../../components/ui'
import { addMinutes, hours } from '../../lib/format'

const QUALITY = ['Mal', 'Regular', 'Bien', 'Muy bien']

export default function Sueno() {
  const s = useStore()
  const back = useBack('/hoy')
  const [h, setH] = useState(s.sleep)
  const [q, setQ] = useState(s.sleepQuality)
  const wake = s.wake || '7:10'
  const bed = addMinutes(wake, -Math.round(h * 60))
  const save = () => { s.setSleep(h, { sleepQuality: q, bed }); back() }

  return (
    <Screen nav={false} action={<Btn onClick={save}>Guardar</Btn>}>
      <TopBar back="Hoy" to="/hoy" />
      <div className="center-stack">
        <Character forma="descanso" expr={h < 6 ? 'dormido' : h >= 7 ? 'satisfecho' : 'contento'} level={(h / 9) * 100} size={118} label="Luna" />
        <h1 className="display h1 mt8">¿Cómo dormiste?</h1>
      </div>
      <Stepper value={h} onChange={setH} step={0.5} min={2} max={12} format={hours} label="media hora" sub={`Te acostaste ${bed} · te levantaste ${wake}`} />
      <div className="chips" role="group" aria-label="Calidad del sueño" style={{ justifyContent: 'center' }}>
        {QUALITY.map((x) => <Chip key={x} on={q === x} tone="rest" onClick={() => setQ(x)}>{x}</Chip>)}
      </div>
      <Collapse show={h < 6}>
        <div className="notice tint-hero">
          <div className="stack g4">
            <p className="t">Dormir poco afecta tu rendimiento</p>
            <p>Hoy te proponemos algo más liviano. Podés aceptarlo o seguir con tu plan.</p>
          </div>
        </div>
      </Collapse>
    </Screen>
  )
}
