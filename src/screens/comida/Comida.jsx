import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { mealTotals, useStore } from '../../store'
import { MEAL_NAMES, YESTERDAY_DINNER } from '../../data'
import Character from '../../components/Character'
import Icon from '../../components/Icons'
import { Bar, Btn, Chip, MiniStep, Num, Screen, Sheet, Tap, Thumb, Title, TopBar, useBack } from '../../components/ui'
import { fmt, toMeal } from '../../lib/format'

function Macro({ name, value, goal, color, strong }) {
  return (
    <div className="stack g6" style={{ minWidth: 0 }}>
      <span className={`xs${strong ? ' fw6' : ''}`}>{name}</span>
      <span className="num" style={{ fontSize: 16 }}><Num value={value} /> / {goal} g</span>
      <Bar value={value} max={goal} color={color} track="rgba(22,23,29,.1)" label={`${name}: ${value} de ${goal} gramos`} />
    </div>
  )
}

/* Comida de hoy */
export function Inicio() {
  const s = useStore()
  const missing = Math.max(0, s.protGoal - s.prot)
  const dinner = s.meals.find((m) => m.meal === 'Cena' && m.items.length)
  const repeat = () => {
    s.addMeal('Cena', YESTERDAY_DINNER.desc, YESTERDAY_DINNER.items.map((x) => ({ ...x, id: `${x.id}-${Date.now()}` })), { source: 'repetido de ayer' })
    s.notify('Repetimos la cena de ayer', 'comida')
  }
  return (
    <Screen>
      <Title sub={`Objetivo: ${s.goal.type.toLowerCase()} · ${s.deficit > 0 ? 'déficit moderado' : s.deficit < 0 ? 'superávit leve' : 'mantenimiento'}`}>Comida de hoy</Title>

      <section className="card soft tint-food stack g16 food-sum" aria-label="Resumen del día">
        <div className="row between g12" style={{ alignItems: 'flex-start' }}>
          <p className="stack g4" style={{ flex: 1, minWidth: 0 }}>
            <span><Num value={s.kcal} className="num" style={{ fontSize: 'clamp(28px, 8.4cqi, 34px)' }} /> <span className="num" style={{ fontSize: 'clamp(28px, 8.4cqi, 34px)' }}>kcal</span></span>
            <span className="small">de {fmt(s.kcalGoal)} · te quedan {fmt(Math.max(0, s.kcalGoal - s.kcal))}</span>
          </p>
          <Character forma="comida" expr={s.prot >= s.protGoal ? 'satisfecho' : 'contento'} level={(s.kcal / s.kcalGoal) * 100} size={56} />
        </div>
        <Bar value={s.kcal} max={s.kcalGoal} color="var(--food)" thick track="rgba(22,23,29,.1)" label="Calorías" />
        <div className="macros">
          <Macro name="Proteína" value={s.prot} goal={s.protGoal} color="var(--food)" strong />
          <Macro name="Carbohidratos" value={s.carb} goal={s.carbGoal} color="var(--ink)" />
          <Macro name="Grasas" value={s.fat} goal={s.fatGoal} color="var(--ink)" />
        </div>
      </section>

      <div className="scroll-x" aria-label="Cargar comida">
        <Tap to="/comida/buscar" className="chip"><Icon name="search" size={16} /> Buscar</Tap>
        <Tap to="/comida/escanear" className="chip"><Icon name="barcode" size={16} /> Escanear</Tap>
        {!dinner && <Chip onClick={repeat}>Repetir ayer</Chip>}
        <Tap to="/comida/foto" className="chip"><Icon name="camera" size={16} /> Foto del plato <span className="badge">Pro</span></Tap>
      </div>

      <div className="card list" aria-label="Comidas del día">
        {MEAL_NAMES.map((name) => {
          const m = s.meals.find((x) => x.meal === name)
          if (!m || !m.items.length) {
            return (
              <Tap key={name} to={`/comida/buscar?comida=${name}`} className="list-item meal-row">
                <span className="thumb empty-thumb" style={{ width: 52, height: 52, borderRadius: 15 }} />
                <span className="grow stack g4"><span className="t">{name}</span><span className="d">Todavía sin cargar</span></span>
                <span className="fw6 t14 nowrap">+ Agregar</span>
              </Tap>
            )
          }
          const t = mealTotals(m)
          return (
            <Tap key={name} to={`/comida/detalle/${m.id}`} className="list-item meal-row">
              <Thumb src={m.img} alt="" size={52} tone="food" forma="comida" />
              <span className="grow stack g4" style={{ minWidth: 0 }}>
                <span className="row between g8"><span className="t">{name}</span><span className="t14 fw6 nowrap">{fmt(t.kcal)} kcal</span></span>
                <span className="row between g8"><span className="d ellipsis">{m.desc}</span><span className="d nowrap">{t.prot} g prot.</span></span>
              </span>
            </Tap>
          )
        })}
      </div>

      <div className="card soft tint-rest stack g6">
        {missing > 0
          ? <><p className="display h3">Te faltan {missing} g de proteína</p><p className="t15">Para la cena: huevos, atún o lentejas con arroz.</p>
            <div className="row g8 wrap mt4">{['huevo', 'atun', 'lentejas'].map((id) => <Tap key={id} to={`/comida/porcion/${id}?comida=Cena`} className="chip">{{ huevo: 'Huevos', atun: 'Atún', lentejas: 'Lentejas' }[id]}</Tap>)}</div></>
          : <><p className="display h3">Llegaste a tu proteína de hoy</p><p className="t15">Bien ahí. Lo que sigue suma energía para mañana.</p></>}
      </div>

      <Tap to="/comida/numeros" className="link" style={{ alignSelf: 'flex-start', minHeight: 44 }}>Cómo calculamos tus números</Tap>
    </Screen>
  )
}

/* Detalle de una comida: ingredientes editables */
export function Detalle() {
  const { id } = useParams()
  const s = useStore()
  const back = useBack('/comida')
  const [edit, setEdit] = useState(null)
  const [ask, setAsk] = useState(false)
  const m = s.meals.find((x) => x.id === id)
  if (!m) return <Screen><TopBar back="Comida de hoy" to="/comida" /><Title>Esta comida ya no está</Title></Screen>
  const t = mealTotals(m)
  const patchItems = (items) => s.set((st) => ({ meals: st.meals.map((x) => (x.id === id ? { ...x, items } : x)) }))
  const scale = (item, f) => {
    const base = item.base || item
    return { ...item, base, f, kcal: Math.round(base.kcal * f), prot: Math.round(base.prot * f), carb: Math.round(base.carb * f), fat: Math.round(base.fat * f) }
  }
  const save = () => { s.set((st) => ({ favMeals: [...st.favMeals.filter((f) => f.desc !== m.desc), { id: `f${Date.now()}`, name: m.desc, desc: m.desc, items: m.items, img: m.img }] })); s.notify('Guardada en Mis comidas', 'comida') }
  const remove = () => { s.set((st) => ({ meals: st.meals.filter((x) => x.id !== id) })); s.notify(`Eliminamos ${toMeal(m.meal).replace(/^a /, '').replace(/^al /, 'el ')} de hoy`, 'comida'); back() }
  const cur = edit && m.items.find((x) => x.id === edit)
  return (
    <Screen>
      <TopBar back="Comida de hoy" to="/comida" />
      <Title sub={`${m.time} · cargado con ${m.source}`}>{m.meal}</Title>
      {m.img && <img src={m.img} alt={`Foto: ${m.desc}`} className="photo" />}
      <div className="card list">
        {m.items.map((it) => (
          <div key={it.id} className="list-item" style={{ cursor: 'default' }}>
            <span className="grow stack g4"><span className="t">{it.name}</span><span className="d">{it.f && it.f !== 1 ? `${fmt(it.f, 2)} × ` : ''}{it.amount} · {fmt(it.kcal)} kcal{it.prot ? ` · ${it.prot} g prot.` : ''}</span></span>
            <button type="button" className="hit" aria-label={`Editar ${it.name}`} onClick={() => setEdit(it.id)} style={{ color: 'var(--muted)' }}><Icon name="edit" size={20} stroke={1.6} /></button>
          </div>
        ))}
      </div>
      <div className="notice tint-food" style={{ alignItems: 'center' }}>
        <Character forma="comida" expr="satisfecho" level={80} size={48} />
        <div className="stack g4">
          <p className="display h3"><Num value={t.kcal} /> kcal · <Num value={t.prot} /> g de proteína</p>
          <p>{t.prot >= 25 ? 'Una comida completa: proteína, carbohidratos y verdura.' : 'Si querés, sumale algo con proteína.'}</p>
        </div>
      </div>
      <Btn kind="sec" onClick={save}>Guardar como comida frecuente</Btn>
      <button type="button" className="link warn" style={{ alignSelf: 'center', minHeight: 44 }} onClick={() => setAsk(true)}>Eliminar esta comida</button>

      <Sheet open={!!cur} onClose={() => setEdit(null)} title={cur?.name}>
        {cur && <>
          <p className="small muted">Porción original: {cur.amount}. Ajustá cuánto comiste.</p>
          <div className="row between g12">
            <span className="t15 fw6">Cantidad</span>
            <MiniStep value={cur.f || 1} onChange={(f) => patchItems(m.items.map((x) => (x.id === cur.id ? scale(x, f) : x)))} step={0.25} min={0.25} max={4} format={(v) => `${fmt(v, 2)} ×`} label="porción" />
          </div>
          <div className="tiles">
            <div className="tile"><span className="num">{cur.kcal}</span><span className="xs">kcal</span></div>
            <div className="tile"><span className="num">{cur.prot} g</span><span className="xs">Proteína</span></div>
            <div className="tile"><span className="num">{cur.carb} g</span><span className="xs">Carbos</span></div>
          </div>
          <Btn onClick={() => setEdit(null)}>Listo</Btn>
          <button type="button" className="link warn" style={{ alignSelf: 'center', minHeight: 44 }} onClick={() => { patchItems(m.items.filter((x) => x.id !== cur.id)); setEdit(null) }}>Quitar ingrediente</button>
        </>}
      </Sheet>
      <Sheet open={ask} onClose={() => setAsk(false)} title="¿Eliminamos esta comida?">
        <p className="t15 muted">Se borra {m.meal.toLowerCase()} de hoy. Lo podés volver a cargar cuando quieras.</p>
        <Btn onClick={remove}>Sí, eliminar</Btn>
        <Btn kind="sec" onClick={() => setAsk(false)}>Cancelar</Btn>
      </Sheet>
    </Screen>
  )
}

/* Tus números, explicados */
export function Numeros() {
  const s = useStore()
  return (
    <Screen>
      <TopBar back="Comida de hoy" to="/comida" />
      <Title>Tus números, explicados</Title>
      <div className="card stack g12">
        <p className="small muted fw6">Calorías del día</p>
        <p className="num" style={{ fontSize: 34 }}>{fmt(s.kcalGoal)} kcal</p>
        <div className="calc">
          <span>Lo que gastás por día (estimado)</span><span className="num">{fmt(s.tdee)}</span>
          <span>{s.deficit >= 0 ? 'Déficit moderado' : 'Superávit leve'}</span><span className="num">{s.deficit >= 0 ? '−' : '+'} {fmt(Math.abs(s.deficit))}</span>
          <span className="fw6">Tu objetivo</span><span className="num">{fmt(s.kcalGoal)}</span>
        </div>
      </div>
      <div className="card soft tint-food stack g8">
        <p className="small fw6">Proteína</p>
        <p className="display h2">{s.protGoal} g por día</p>
        <p className="t15">1,6 g por kg de tu peso. Ayuda a mantener el músculo mientras bajás grasa.</p>
      </div>
      <div className="card soft tint-rest stack g8">
        <p className="display h3">Nuestros límites</p>
        <p className="t15">Nunca te proponemos bajar más del 1 % de tu peso por semana, ni un déficit que te deje sin energía para entrenar. Si un objetivo no es seguro, te lo decimos y te mostramos un plazo realista.</p>
      </div>
      <div className="card row g14">
        <Character forma="descanso" expr="contento" level={60} size={52} />
        <p className="t15">Cada domingo revisamos tu tendencia y ajustamos si hace falta. Vos decidís si aplicar el cambio.</p>
      </div>
      <p className="small muted">Son estimaciones. Si tenés una condición de salud, consultá con un profesional de nutrición.</p>
    </Screen>
  )
}
