import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store'
import { IMG, PLATE_GUESS } from '../../data'
import Character from '../../components/Character'
import { StatusBar } from '../../components/Shell'
import { Btn, MiniStep, Num, Screen, Title, TopBar, useBackTo } from '../../components/ui'
import { toMeal } from '../../lib/format'
import { pickMeal } from './util'

const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2]

/* Escanear código de barras (simulado) */
export function Escanear() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [q] = useSearchParams()
  const s = useStore()
  const meal = pickMeal(q, s.meals)
  const [found, setFound] = useState(false)
  const [manual, setManual] = useState(false)
  const [code, setCode] = useState('')
  const [round, setRound] = useState(0)
  useEffect(() => { const t = setTimeout(() => setFound(true), 2600); return () => clearTimeout(t) }, [round])
  return (
    <Screen nav={false} dark label="Escanear código">
      <StatusBar clear />
      <TopBar back="Comida de hoy" to="/comida" light />
      <Title sub="Cargamos el producto con sus calorías y macros, sin tipear nada. Sirve para todo lo que viene envasado.">Escaneá el código de barras del envase</Title>
      <div className="scanner" aria-label={found ? 'Producto encontrado' : 'Buscando el código de barras'}>
        <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
        <div className="barcode" aria-hidden="true">{BARS.map((w, i) => <span key={i} style={{ width: w * 2.5 }} />)}</div>
        {!found && !reduce && (
          <motion.span className="line" initial={{ top: '14%' }} animate={{ top: ['14%', '86%'] }} transition={{ duration: 1.3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />
        )}
        {!found && reduce && <span className="line" style={{ top: '50%' }} />}
        <AnimatePresence>{found && <motion.span className="flash" initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }} />}</AnimatePresence>
      </div>
      {!manual
        ? <button type="button" className="link" style={{ alignSelf: 'center', fontWeight: 500 }} onClick={() => setManual(true)}>También podés escribir el código a mano</button>
        : (
          <form className="row g8" onSubmit={(e) => { e.preventDefault(); if (code.length >= 6) setFound(true) }}>
            <label className="field grow" style={{ minHeight: 56 }}><span className="lbl">Código</span><input inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 13))} placeholder="7790000000000" autoFocus /></label>
            <Btn kind="sm white" type="submit" style={{ minHeight: 56, borderRadius: 16 }}>Buscar</Btn>
          </form>
        )}
      <AnimatePresence>
        {found && (
          <motion.div className="scan-result stack g12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} role="status">
            <div className="row g12">
              <span className="thumb" style={{ width: 52, height: 52, borderRadius: 14, background: '#D4F3FA' }}><Character forma="agua" expr="contento" level={70} size={24} breathe={false} /></span>
              <div className="stack g4"><p className="fw6" style={{ fontSize: 16 }}>Leche descremada</p><p className="small" style={{ color: '#5E6272' }}>200 ml · 70 kcal · 7 g prot.</p></div>
            </div>
            <Btn kind="ink-fixed" onClick={() => navigate(`/comida/porcion/leche?comida=${meal}`, { replace: true })}>Usar este</Btn>
            <button type="button" className="link" style={{ alignSelf: 'center', color: '#16171D', minHeight: 40 }} onClick={() => { setFound(false); setRound((r) => r + 1) }}>Escanear otro</button>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  )
}

/* Foto del plato (Pro): barrido de escaneo y los ítems aparecen uno a uno */
export function FotoPlato() {
  const s = useStore()
  const reduce = useReducedMotion()
  const backTo = useBackTo()
  const [q] = useSearchParams()
  const meal = pickMeal(q, s.meals)
  const [ready, setReady] = useState(false)
  const [items, setItems] = useState(PLATE_GUESS.map((x) => ({ ...x, edit: false })))
  useEffect(() => { const t = setTimeout(() => setReady(true), reduce ? 200 : 2000); return () => clearTimeout(t) }, [reduce])
  const calc = (x) => ({ kcal: Math.round(x.grams * x.per.kcal), prot: Math.round(x.grams * x.per.prot), carb: Math.round(x.grams * x.per.carb), fat: Math.round(x.grams * x.per.fat) })
  const tot = items.reduce((a, x) => { const c = calc(x); return { kcal: a.kcal + c.kcal, prot: a.prot + c.prot } }, { kcal: 0, prot: 0 })
  const outOfTrials = !s.pro && s.plateTrials <= 0
  const save = () => {
    s.addMeal(meal, 'Pollo, arroz y ensalada', items.map((x) => ({ id: `${x.name}-${Date.now()}`, name: x.name, amount: `${x.grams} g`, ...calc(x) })), { img: IMG.plato, source: 'foto del plato' })
    if (!s.pro) s.set((st) => ({ plateTrials: Math.max(0, st.plateTrials - 1) }))
    s.notify(`Plato guardado ${toMeal(meal)}`, 'comida')
    backTo('/comida')
  }
  if (outOfTrials) {
    return (
      <Screen nav={false}>
        <TopBar back="Comida de hoy" to="/comida" />
        <div className="center-stack" style={{ marginTop: 24 }}>
          <Character forma="comida" expr="contento" level={50} size={96} />
          <h1 className="display h1">Usaste tus 3 fotos de prueba</h1>
          <p className="t15 muted">La foto del plato es parte de Pro porque cuesta mantenerla. Podés seguir cargando todo gratis con el buscador o el escáner.</p>
        </div>
        <Btn to="/perfil/pro">Ver Pro</Btn>
        <Btn kind="sec" to={`/comida/buscar?comida=${meal}`} replace>Cargar con el buscador</Btn>
      </Screen>
    )
  }
  return (
    <Screen nav={false} action={<Btn onClick={save} disabled={!ready}>Guardar {toMeal(meal).replace(/^a la /, "en la ").replace(/^al /, "en el ")}</Btn>}>
      <TopBar back="Comida de hoy" to="/comida" />
      <div className="row g8"><span className="badge">Pro</span><span className="small muted">{s.pro ? 'Pro activo' : `Te quedan ${s.plateTrials} ${s.plateTrials === 1 ? 'foto' : 'fotos'} de prueba`}</span></div>
      <div className="photo-wrap">
        <img src={IMG.plato} alt="Foto del plato: arroz, pollo y ensalada" className="photo" style={{ aspectRatio: '16 / 10', borderRadius: 0 }} />
        {!ready && !reduce && <motion.div className="sweep" initial={{ top: '-40%' }} animate={{ top: ['-40%', '100%'] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />}
        {!ready && <span className="analyzing">Mirando tu plato…</span>}
      </div>
      <Title sub="La foto estima: revisá las cantidades antes de guardar.">Esto es lo que vemos</Title>
      <div className="card list" aria-live="polite">
        {!ready && [0, 1, 2].map((i) => <div key={i} className="list-item" style={{ cursor: 'default' }}><span className="skeleton" style={{ width: `${70 - i * 12}%` }} /></div>)}
        {ready && items.map((x, i) => {
          const c = calc(x)
          return (
            <motion.div key={x.name} className="list-item" style={{ cursor: 'default', flexWrap: 'wrap' }} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
              <span className="grow stack g4"><span className="t">{x.name}</span><span className="d">≈ {x.grams} g · {c.kcal} kcal{c.prot ? ` · ${c.prot} g prot.` : ''}</span></span>
              <button type="button" className="link" style={{ minHeight: 44 }} onClick={() => setItems((a) => a.map((y, j) => (j === i ? { ...y, edit: !y.edit } : y)))}>{x.edit ? 'Listo' : 'Editar'}</button>
              {x.edit && <div className="w100 row between" style={{ paddingTop: 4 }}><span className="small muted">Gramos</span><MiniStep value={x.grams} step={10} min={10} max={600} format={(v) => `${v} g`} label={`gramos de ${x.name}`} onChange={(v) => setItems((a) => a.map((y, j) => (j === i ? { ...y, grams: v } : y)))} /></div>}
            </motion.div>
          )
        })}
      </div>
      <Link to={`/comida/buscar?comida=${meal}`} className="link" style={{ alignSelf: 'flex-start' }}>+ Agregar algo que no detectamos</Link>
      <div className="row between">
        <span className="t15 fw6">Total</span>
        <span className="num" style={{ fontSize: 20 }}>{ready ? <><Num value={tot.kcal} /> kcal · <Num value={tot.prot} /> g prot.</> : '…'}</span>
      </div>
    </Screen>
  )
}
