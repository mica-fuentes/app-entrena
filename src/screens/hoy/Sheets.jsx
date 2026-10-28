import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, MiniStep, Num, Sheet, Tap } from '../../components/ui'
import { liters } from '../../lib/format'

/* Hoja del + : registro rápido */
function QuickAdd({ open, close }) {
  const navigate = useNavigate()
  const { setSheet } = useStore()
  const go = (to) => { close(); navigate(to) }
  const items = [
    { t: 'Comida', d: 'Buscá un alimento o repetí una comida', ico: <Character forma="comida" expr="contento" level={60} size={28} breathe={false} />, tone: 'food', on: () => go('/comida/buscar') },
    { t: 'Foto del plato', pro: true, d: 'Le sacás una foto y estimamos qué hay y cuánto', ico: <Icon name="camera" />, tone: 'food', on: () => go('/comida/foto') },
    { t: 'Escanear código de barras', d: 'Del envase de un producto: carga calorías y macros solo', ico: <Icon name="barcode" />, tone: 'food', on: () => go('/comida/escanear') },
    { t: 'Agua', d: '+250 ml, +500 ml u otra cantidad', ico: <Character forma="agua" expr="contento" level={60} size={26} breathe={false} />, tone: 'water', on: () => setSheet('agua') },
    { t: 'Peso o medidas', d: 'Mejor a la mañana, en ayunas', ico: <Icon name="scale" />, tone: 'primary', on: () => go('/progreso/peso') },
    { t: 'Sueño', d: 'Cuánto y cómo dormiste', ico: <Character forma="descanso" expr="dormido" level={60} size={30} breathe={false} />, tone: 'rest', on: () => go('/sueno') },
  ]
  return (
    <Sheet open={open} onClose={close} title="¿Qué querés registrar?" aboveNav>
      <div className="stack" style={{ marginTop: -4 }}>
        {items.map((x, i) => (
          <motion.div key={x.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
            <Tap className="list-item" onClick={x.on}>
              <span className={`qa-ico tint-${x.tone}`}>{x.ico}</span>
              <span className="grow stack g4">
                <span className="row g8"><span className="t">{x.t}</span>{x.pro && <span className="badge">Pro</span>}</span>
                <span className="d">{x.d}</span>
              </span>
              <Icon name="chevron" size={18} style={{ color: 'var(--muted)' }} />
            </Tap>
          </motion.div>
        ))}
      </div>
    </Sheet>
  )
}

/* Hoja de agua */
function Agua({ open, close }) {
  const { water, waterGoal, addWater, removeWater } = useStore()
  const [other, setOther] = useState(false)
  const [ml, setMl] = useState(350)
  const left = Math.max(0, waterGoal - water)
  return (
    <Sheet open={open} onClose={close} label="Agua">
      <div className="center-stack" style={{ gap: 8 }}>
        <Character forma="agua" expr={water >= waterGoal ? 'satisfecho' : 'energia'} level={(water / waterGoal) * 100} size={110} label={`Gota llena al ${Math.round((water / waterGoal) * 100)} %`} />
        <p className="mt8"><Num value={water} format={(v) => `${liters(v)} L`} className="num" style={{ fontSize: 36 }} /> <span className="muted t15">de {liters(waterGoal)} L</span></p>
        <p className="small muted">{left > 0 ? `Te faltan ${liters(left)} L para tu meta de hoy.` : 'Llegaste a tu meta de hoy. ¡Bien ahí!'}</p>
      </div>
      <div className="grid3">
        <Btn kind="tint-water" className="water-btn" onClick={() => addWater(250)}>+250 ml</Btn>
        <Btn kind="tint-water" className="water-btn" onClick={() => addWater(500)}>+500 ml</Btn>
        <Btn kind="sec" className="water-btn" onClick={() => setOther((o) => !o)} aria-expanded={other}>Otra</Btn>
      </div>
      <div className="center-stack">
        <button type="button" className="link" disabled={water <= 0} onClick={() => removeWater(250)} style={{ minHeight: 44, opacity: water <= 0 ? 0.4 : 1 }}>Me equivoqué: restar 250 ml</button>
      </div>
      <AnimatePresence initial={false}>
        {other && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div className="card row between g12" style={{ padding: 12 }}>
              <MiniStep value={ml} onChange={setMl} step={50} min={50} max={1500} format={(v) => `${v} ml`} label="mililitros" />
              <Btn kind="sm ink" onClick={() => { addWater(ml); setOther(false) }}>Sumar</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="notice tint-rest" style={{ padding: '12px 16px' }}>
        <p>Hoy entrenás piernas: tu meta sube 0,4 L.</p>
      </div>
      <Btn onClick={close}>Listo</Btn>
    </Sheet>
  )
}

export function GlobalSheets() {
  const { sheet, setSheet } = useStore()
  const close = () => setSheet(null)
  return (
    <>
      <QuickAdd open={sheet === 'add'} close={close} />
      <Agua open={sheet === 'agua'} close={close} />
    </>
  )
}
