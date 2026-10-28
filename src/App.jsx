import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import Character from './components/Character'
import Icon from './components/Icons'

/*
  PUNTO DE PARTIDA. Esta pantalla solo demuestra que la base funciona:
  tokens claro/oscuro, tipografías, personajes animados y el estado guardado.
  Claude Code reemplaza esto por la app completa siguiendo docs/SPEC.md.
*/
function Demo() {
  const { water, waterGoal, addWater, theme, set } = useStore()
  const [lv, setLv] = useState({ entreno: 25, comida: 75, descanso: 50 })
  const bump = (k) => setLv((s) => ({ ...s, [k]: Math.min(100, s[k] + 25) }))
  const agua = Math.round((water / waterGoal) * 100)
  return (
    <div className="device">
      <div className="scroller">
        <main className="screen no-nav">
          <div className="row between">
            <div className="stack g4">
              <p className="small muted">Base del proyecto</p>
              <h1 className="display h1">Tocá un personaje</h1>
            </div>
            <button className="round" aria-label="Cambiar tema" onClick={() => set({ theme: theme === 'dark' ? 'light' : 'dark' })}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
          <div className="grid2">
            <button className="card soft tint-training stack g8" style={{ border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => bump('entreno')}>
              <Character forma="entreno" expr="contento" level={lv.entreno} size={64} />
              <span className="num h2">{Math.round(lv.entreno / 25)} de 4</span>
            </button>
            <button className="card soft tint-food stack g8" style={{ border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => bump('comida')}>
              <Character forma="comida" expr="contento" level={lv.comida} size={64} />
              <span className="num h2">{Math.round(110 * lv.comida / 100)} g</span>
            </button>
            <button className="card soft tint-water stack g8" style={{ border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => addWater(250)}>
              <Character forma="agua" expr="energia" level={agua} size={60} />
              <span className="num h2">{(water / 1000).toFixed(2).replace('.', ',')} L</span>
            </button>
            <button className="card soft tint-rest stack g8" style={{ border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => bump('descanso')}>
              <Character forma="descanso" expr={lv.descanso >= 75 ? 'satisfecho' : 'dormido'} level={lv.descanso} size={70} />
              <span className="num h2">{Math.round(8 * lv.descanso / 100)} h</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <StoreProvider><Demo /></StoreProvider>
}
