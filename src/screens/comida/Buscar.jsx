import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useStore } from '../../store'
import { FOODS, MEAL_NAMES } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Btn, Chip, Num, Screen, Stepper, Tap, Thumb, Title, TopBar, useBackTo } from '../../components/ui'
import { fmt, toMeal } from '../../lib/format'
import { findFood, norm, pickMeal, portionText } from './util'

function FoodRow({ f, onAdd, to }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="food-row">
      <Tap to={to} className="list-item grow" style={{ minWidth: 0 }}>
        <span className="grow stack g4" style={{ minWidth: 0 }}>
          <span className="t">{f.name}</span>
          <span className="d">{portionText(f)} · {fmt(f.kcal)} kcal · {f.prot} g prot.</span>
        </span>
      </Tap>
      <motion.button type="button" className="plus-btn plus-44" aria-label={`Sumar ${f.name}`} onClick={onAdd} whileTap={{ scale: 0.85 }}><Icon name="plus" size={18} stroke={2.2} /></motion.button>
    </motion.div>
  )
}

/* Buscar alimento: filtro en vivo */
export function Buscar() {
  const s = useStore()
  const navigate = useNavigate()
  const [q] = useSearchParams()
  const meal = pickMeal(q, s.meals)
  const [text, setText] = useState(q.get('q') || '')
  const [tab, setTab] = useState('Resultados')
  const all = [...s.customFoods, ...FOODS]
  const words = norm(text).split(/\s+/).filter(Boolean)
  const results = words.length ? all.filter((f) => words.every((w) => norm(f.name).includes(w))) : all.slice(0, 10)
  const similar = words.length && !results.length ? all.filter((f) => words.some((w) => w.length > 3 && norm(f.name).includes(w))).slice(0, 4) : []
  const recents = s.recentFoods.map((id) => findFood(id, s.customFoods)).filter(Boolean)
  const list = tab === 'Recientes' ? recents.filter((f) => !words.length || words.every((w) => norm(f.name).includes(w))) : tab === 'Mis comidas' ? s.customFoods : results
  const add = (f) => s.addFood(f, 1, meal)
  const addFav = (m) => { s.addMeal(meal, m.desc, m.items.map((x) => ({ ...x, id: `${x.id}-${Date.now()}` }))); s.notify(`${m.name}: sumado ${toMeal(meal)}`, 'comida') }
  const porcion = (f) => `/comida/porcion/${f.id}?comida=${meal}`
  const empty = tab === 'Resultados' && words.length > 0 && results.length === 0

  return (
    <Screen nav={false}>
      <TopBar back="Comida de hoy" to="/comida" />
      <Title>Agregar {toMeal(meal)}</Title>
      <label className="search">
        <Icon name="search" size={20} style={{ color: 'var(--muted)' }} />
        <input type="search" enterKeyHint="search" placeholder="Buscá un alimento o una marca" value={text} onChange={(e) => { setText(e.target.value); if (tab === 'Mis comidas') setTab('Resultados') }} aria-label="Buscar alimento" />
        {text && <button type="button" className="hit" aria-label="Borrar búsqueda" onClick={() => setText('')} style={{ marginRight: -10 }}><Icon name="close" size={16} /></button>}
      </label>
      <div className="scroll-x" role="tablist" aria-label="Dónde buscar">
        {['Resultados', 'Recientes', 'Mis comidas'].map((t) => <Chip key={t} role="tab" aria-selected={tab === t} on={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}
        <Tap to="/comida/escanear" className="chip"><Icon name="barcode" size={16} /> Escanear</Tap>
      </div>

      {empty ? (
        <motion.div className="stack g16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="center-stack" style={{ padding: '8px 0' }}>
            <Character forma="comida" expr="cansado" level={30} size={92} />
            <h2 className="display h2">No lo encontramos</h2>
            <p className="t15 muted">Las comidas caseras varían mucho. Podés crearla una vez y la tenés guardada para siempre.</p>
          </div>
          <Btn to={`/comida/crear?nombre=${encodeURIComponent(text)}&comida=${meal}`}>Crear "{text}"</Btn>
          {similar.length > 0 && <>
            <p className="small fw6 muted">Parecidos que sí tenemos</p>
            <div className="card list">{similar.map((f) => <FoodRow key={f.id} f={f} to={porcion(f)} onAdd={() => add(f)} />)}</div>
          </>}
        </motion.div>
      ) : (
        <>
          {tab === 'Mis comidas' && s.favMeals.length > 0 && (
            <div className="card list">
              {s.favMeals.map((m) => (
                <div key={m.id} className="food-row">
                  <div className="list-item grow" style={{ cursor: 'default' }}>
                    <Thumb src={m.img} alt="" size={44} radius={12} tone="food" forma="comida" />
                    <span className="grow stack g4"><span className="t">{m.name}</span><span className="d">Comida frecuente · {fmt(m.items.reduce((a, x) => a + x.kcal, 0))} kcal</span></span>
                  </div>
                  <motion.button type="button" className="plus-btn plus-44" aria-label={`Sumar ${m.name}`} onClick={() => addFav(m)} whileTap={{ scale: 0.85 }}><Icon name="plus" size={18} stroke={2.2} /></motion.button>
                </div>
              ))}
            </div>
          )}
          {list.length > 0 ? (
            <div className="card list">
              <AnimatePresence initial={false} mode="popLayout">
                {list.map((f) => <FoodRow key={f.id} f={f} to={porcion(f)} onAdd={() => add(f)} />)}
              </AnimatePresence>
            </div>
          ) : tab === 'Mis comidas' && !s.favMeals.length ? (
            <div className="card center-stack" style={{ padding: 24 }}>
              <Character forma="comida" expr="contento" level={40} size={52} />
              <p className="t15">Cuando crees un alimento o guardes una comida frecuente, aparece acá.</p>
            </div>
          ) : null}
          <Tap to={`/comida/crear?nombre=${encodeURIComponent(text)}&comida=${meal}`} className="card dashed-card">
            <span className="t15 muted">¿No está?</span> <span className="link">Crealo en 20 segundos</span>
          </Tap>
        </>
      )}
    </Screen>
  )
}

/* Porción: gramos y macros en vivo */
export function Porcion() {
  const { id } = useParams()
  const [q] = useSearchParams()
  const s = useStore()
  const backTo = useBackTo()
  const f = findFood(id, s.customFoods) || FOODS[0]
  const [meal, setMeal] = useState(pickMeal(q, s.meals))
  const [g, setG] = useState(f.grams)
  const units = [[f.portion, f.grams], ['100 g', 100], ...(f.extra || [])].filter((u, i, a) => a.findIndex((x) => x[1] === u[1]) === i)
  const k = g / f.grams
  const m = (key) => Math.round((f[key] || 0) * k)
  const after = s.prot + m('prot')
  const step = f.grams >= 100 ? 10 : 5
  const unit = units.find((u) => u[1] === g)
  const add = () => { s.addFood(f, k, meal); backTo('/comida') }
  return (
    <Screen nav={false} action={<Btn onClick={add}>Agregar {toMeal(meal)}</Btn>}>
      <TopBar back="Resultados" to="/comida/buscar" />
      {f.img
        ? <img src={f.img} alt={`Foto de ${f.name}`} className="photo" style={{ aspectRatio: '16 / 8' }} />
        : <div className="photo tint-food" style={{ aspectRatio: '16 / 7', display: 'grid', placeItems: 'center' }}><Character forma="comida" expr="contento" level={50} size={72} /></div>}
      <Title sub={f.note || portionText(f)}>{f.name}</Title>
      <Stepper value={g} onChange={setG} step={step} min={step} max={2000} format={(v) => `${fmt(v)} g`} label={`${step} gramos`}
        sub={unit ? unit[0] : `${fmt(g / f.grams, 1)} × ${f.portion}`} />
      <div className="scroll-x" role="group" aria-label="Medidas">
        {units.map(([label, grams]) => <Chip key={label} on={g === grams} onClick={() => setG(grams)}>{label}</Chip>)}
      </div>
      <div className="tiles four" aria-live="polite">
        <div className="tile tint-food" style={{ borderColor: 'transparent' }}><Num value={m('prot')} format={(v) => `${fmt(v)} g`} /><span className="xs">Proteína</span></div>
        <div className="tile"><Num value={m('carb')} format={(v) => `${fmt(v)} g`} /><span className="xs">Carbos</span></div>
        <div className="tile"><Num value={m('fat')} format={(v) => `${fmt(v)} g`} /><span className="xs">Grasas</span></div>
        <div className="tile"><Num value={m('kcal')} /><span className="xs">Kcal</span></div>
      </div>
      <div className="notice tint-food" style={{ alignItems: 'center' }}>
        <Character forma="comida" expr={after >= s.protGoal ? 'satisfecho' : 'contento'} level={(after / s.protGoal) * 100} size={46} />
        <div className="stack g4">
          <p className="t">Con esto llegás a <Num value={after} /> de {s.protGoal} g</p>
          <p className="small">{after >= s.protGoal ? 'Completás la proteína del día.' : s.protGoal - after <= 15 ? 'Casi completás la proteína del día.' : `Te faltan ${s.protGoal - after} g todavía.`}</p>
        </div>
      </div>
      <div className="stack g8">
        <p className="small muted">¿A qué comida lo sumamos?</p>
        <div className="scroll-x" role="group" aria-label="Comida">
          {MEAL_NAMES.map((n) => <Chip key={n} on={meal === n} tone="food" onClick={() => setMeal(n)}>{n}</Chip>)}
        </div>
      </div>
    </Screen>
  )
}

/* Crear alimento */
export function Crear() {
  const [q] = useSearchParams()
  const s = useStore()
  const navigate = useNavigate()
  const [v, setV] = useState({ name: q.get('nombre') || '', portion: '1 unidad', grams: '', kcal: '', prot: '', carb: '', fat: '' })
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }))
  const num = (x) => Math.max(0, parseFloat(String(x).replace(',', '.')) || 0)
  const ok = v.name.trim() && num(v.kcal) > 0
  const save = () => {
    const id = `c${Date.now()}`
    const food = { id, name: v.name.trim().replace(/^./, (c) => c.toUpperCase()), portion: v.portion || '1 porción', grams: num(v.grams) || 100, kcal: num(v.kcal), prot: num(v.prot), carb: num(v.carb), fat: num(v.fat), custom: true }
    s.set((st) => ({ customFoods: [food, ...st.customFoods] }))
    s.notify('Guardado en Mis comidas', 'comida')
    navigate(`/comida/porcion/${id}?comida=${pickMeal(q, s.meals)}`, { replace: true })
  }
  const field = (k, label, ph, mode = 'decimal') => (
    <label className="field"><span className="lbl">{label}</span><input inputMode={mode} placeholder={ph} value={v[k]} onChange={set(k)} /></label>
  )
  return (
    <Screen nav={false} action={<Btn onClick={save} disabled={!ok}>Guardar alimento</Btn>}>
      <TopBar back="Buscar alimento" to="/comida/buscar" />
      <Title sub="Copiá los datos de la etiqueta del envase.">Nuevo alimento</Title>
      <label className="field"><span className="lbl">Nombre</span><input value={v.name} onChange={set('name')} placeholder="Ej. Milanesa de soja casera" autoCapitalize="sentences" /></label>
      <div className="grid2">
        <label className="field"><span className="lbl">Porción</span><input value={v.portion} onChange={set('portion')} placeholder="1 unidad" /></label>
        {field('grams', 'Gramos de la porción', 'Ej. 90', 'numeric')}
      </div>
      <div className="grid2">
        {field('kcal', 'Calorías', 'Ej. 210', 'numeric')}
        {field('prot', 'Proteína (g)', 'Ej. 14')}
        {field('carb', 'Carbohidratos (g)', 'Ej. 18')}
        {field('fat', 'Grasas (g)', 'Ej. 9')}
      </div>
      <Tap to="/comida/escanear" className="notice tint-water" style={{ alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
        <Character forma="agua" expr="contento" level={60} size={36} />
        <p>Si tiene código de barras, escanealo: se carga solo en un segundo.</p>
      </Tap>
    </Screen>
  )
}
