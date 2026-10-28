import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DAY, EXERCISES, MEASURES, START_HISTORY, START_MEALS, START_ROUTINES, WEIGHTS } from './data'
import { toMeal, weekday } from './lib/format'

const KEY = 'app-entrena-v2'
const today = weekday()

const INITIAL = {
  onboarded: false,
  name: 'Sofi',
  theme: 'auto', // auto | light | dark
  hideWeight: false,
  water: 1400, waterGoal: 2300,
  kcalGoal: 1850, protGoal: 110, carbGoal: 210, fatGoal: 60, tdee: 2300, deficit: 450,
  sleep: 5.5, sleepGoal: 8, sleepQuality: 'Regular', bed: '1:40', wake: '7:10',
  sessionsGoal: 4,
  // días de esta semana ya entrenados (0 = lunes). Sin rachas: solo se muestra lo hecho.
  weekDone: today > 0 ? [0] : [],
  meals: START_MEALS,
  weights: WEIGHTS,
  measures: MEASURES,
  photos: [],
  planAdjusted: true, // dormiste poco → una serie menos (la persona puede mantener su plan)
  adviceClosed: false,
  reminders: [
    { id: 'agua', kind: 'agua', title: 'Agua', on: true, every: '2 h', from: '9:00', to: '21:00' },
    { id: 'entreno', kind: 'entreno', title: 'Entrenamiento', on: true, days: [0, 1, 2, 3, 4], time: '12:30', before: '30 min antes' },
    { id: 'comidas', kind: 'comidas', title: 'Comidas', on: false, time: '15:00' },
    { id: 'peso', kind: 'peso', title: 'Pesarte', on: true, day: 6, time: '8:00' },
    { id: 'dormir', kind: 'dormir', title: 'Hora de dormir', on: true, bed: '23:30', wake: '7:30', before: '30 min antes' },
  ],
  goal: { type: 'Tonificar', target: 64, weeks: 12 },
  body: { height: 165, weight: 67.4, birth: '2002-03-14', sex: 'Mujer', activity: 'Algo', years: 3 },
  training: { level: 'Intermedio', days: 4, minutes: 45, place: 'Gimnasio completo' },
  injuries: [{ id: 'rodilla', zone: 'Rodilla derecha', level: 'Leve', since: 'Hace 3 meses' }],
  injuryAlert: true,
  routines: START_ROUTINES,
  activeRoutine: 'r1',
  draft: null,
  history: START_HISTORY,
  session: null,
  lastSession: null,
  recentFoods: ['yogur-griego', 'huevo', 'atun', 'banana', 'pollo'],
  customFoods: [],
  favMeals: [],
  plateTrials: 3,
  pro: false,
  privacy: { improve: false, photosLocal: true },
  paused: null,
  weeklyApplied: false,
  notifications: true,
  firstSteps: { food: false, water: false, workout: false },
}

const Ctx = createContext(null)

function load() {
  try { const s = localStorage.getItem(KEY); return s ? { ...INITIAL, ...JSON.parse(s) } : INITIAL } catch { return INITIAL }
}

const sum = (items, k) => items.reduce((a, i) => a + (i[k] || 0), 0)
export const mealTotals = (m) => ({ kcal: sum(m.items, 'kcal'), prot: sum(m.items, 'prot'), carb: sum(m.items, 'carb'), fat: sum(m.items, 'fat') })

// Arma la sesión de entrenamiento de un día de la rutina
function buildSession(routine, dayIdx, adjusted) {
  const items = routine.plan[dayIdx].map((p) => {
    const ref = DAY.items.find((d) => d.id === p.id)
    const ex = EXERCISES[p.id]
    const n = Math.max(2, p.sets - (adjusted ? 1 : 0))
    const reps = parseInt(p.reps, 10) || 10
    const last = ref?.last || Array.from({ length: p.sets }, () => [ex.kg, reps])
    const kgNow = ref?.suggest ?? last[0][0]
    return { id: p.id, reps: p.reps, rest: p.rest, sets: Array.from({ length: n }, (_, i) => ({ prev: last[i] || last[last.length - 1], kg: kgNow, reps: (last[i] || last[0])[1], done: false })) }
  })
  return { startedAt: Date.now(), routine: routine.id, day: dayIdx, title: routine.titles[dayIdx], idx: 0, items, restEnds: null, restTotal: 0 }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const [sheet, setSheet] = useState(null) // 'add' | 'agua' | null
  const t = useRef()

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* sin almacenamiento */ } }, [state])

  // tema: auto sigue al teléfono
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.theme === 'dark' || (state.theme === 'auto' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.content = dark ? '#121318' : '#F6F7FA' })
    }
    apply(); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [state.theme])

  const notify = useCallback((msg, char = 'agua') => {
    clearTimeout(t.current); setToast({ msg, char, k: Date.now() })
    t.current = setTimeout(() => setToast(null), 2400)
  }, [])

  const set = useCallback((patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })), [])

  const derived = useMemo(() => {
    const tot = state.meals.reduce((a, m) => { const x = mealTotals(m); return { kcal: a.kcal + x.kcal, prot: a.prot + x.prot, carb: a.carb + x.carb, fat: a.fat + x.fat } }, { kcal: 0, prot: 0, carb: 0, fat: 0 })
    const routine = state.routines.find((r) => r.id === state.activeRoutine) || state.routines[0]
    const w = state.weights
    const trend = w.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, w.length)
    return { ...tot, sessions: state.weekDone.length, routine, trend: +trend.toFixed(1) }
  }, [state.meals, state.routines, state.activeRoutine, state.weekDone, state.weights])

  const actions = useMemo(() => ({
    set,
    addWater: (ml) => {
      set((s) => ({ water: Math.min(s.waterGoal + 1500, s.water + ml), firstSteps: { ...s.firstSteps, water: true } }))
      notify(`+${ml} ml registrados. ¡Bien ahí!`, 'agua')
    },
    addFood: (food, qty, meal, quiet) => {
      const r = (k) => Math.round((food[k] || 0) * qty)
      const grams = Math.round(food.grams * qty)
      const item = { id: `${food.id}-${Date.now()}`, name: food.name, amount: `${grams} g`, kcal: r('kcal'), prot: r('prot'), carb: r('carb'), fat: r('fat') }
      set((s) => {
        const meals = [...s.meals]
        const i = meals.findIndex((m) => m.meal === meal)
        if (i >= 0) meals[i] = { ...meals[i], items: [...meals[i].items, item], desc: meals[i].items.length ? `${meals[i].desc}, ${food.name.toLowerCase()}` : food.name }
        else meals.push({ id: `m${Date.now()}`, meal, time: new Date().toLocaleTimeString('es-AR', { hour: 'numeric', minute: '2-digit' }), source: 'buscador', desc: food.name, img: food.img, items: [item] })
        const recentFoods = [food.id, ...s.recentFoods.filter((x) => x !== food.id)].slice(0, 8)
        return { meals, recentFoods, firstSteps: { ...s.firstSteps, food: true } }
      })
      if (!quiet) notify(`${food.name}: sumado ${toMeal(meal)}`, 'comida')
    },
    addMeal: (meal, desc, items, extra = {}) => {
      set((s) => {
        const meals = [...s.meals]
        const i = meals.findIndex((m) => m.meal === meal)
        if (i >= 0) meals[i] = { ...meals[i], ...extra, items: [...meals[i].items, ...items], desc: meals[i].items.length ? `${meals[i].desc}, ${desc.toLowerCase()}` : desc }
        else meals.push({ id: `m${Date.now()}`, meal, time: new Date().toLocaleTimeString('es-AR', { hour: 'numeric', minute: '2-digit' }), source: 'buscador', desc, items, ...extra })
        return { meals, firstSteps: { ...s.firstSteps, food: true } }
      })
    },
    setSleep: (h, extra = {}) => {
      set({ sleep: h, adviceClosed: false, planAdjusted: h < 6, ...extra })
      notify(h >= 7 ? 'Descansaste bien. ¡A aprovecharlo!' : 'Anotado. Hoy vamos más tranqui.', 'descanso')
    },
    logWeight: (kg) => { set((s) => ({ weights: [...s.weights.slice(1), kg], body: { ...s.body, weight: kg } })); notify('Peso guardado. Mirá la tendencia, no el número del día.', 'comida') },
    startWorkout: (dayIdx = 0) => set((s) => {
      if (s.session && s.session.day === dayIdx) return {}
      const routine = s.routines.find((r) => r.id === s.activeRoutine) || s.routines[0]
      return { session: buildSession(routine, Math.min(dayIdx, routine.plan.length - 1), s.planAdjusted && s.sleep < 6) }
    }),
    updateSession: (fn) => set((s) => (s.session ? { session: fn(s.session) } : {})),
    finishWorkout: () => set((s) => {
      const ses = s.session
      if (!ses) return {}
      const done = ses.items.flatMap((x) => x.sets.filter((z) => z.done).map((z) => ({ ...z, id: x.id })))
      const volume = done.reduce((a, z) => a + (z.kg || 0) * (z.reps || 0), 0)
      const prs = done.filter((z) => z.id === 'hip' && z.kg > 60)
      const best = prs.sort((a, b) => b.kg - a.kg || b.reps - a.reps)[0]
      const minutes = Math.max(1, Math.round((Date.now() - ses.startedAt) / 60000))
      // si no se completó ninguna serie mostramos la sesión de referencia del diseño
      const demo = done.length === 0
      const last = demo
        ? { title: ses.title, minutes: 47, volume: 8420, sets: 18, records: 1, record: { name: 'Hip thrust', kg: 62.5, reps: 8 } }
        : { title: ses.title, minutes, volume: Math.round(volume), sets: done.length, records: best ? 1 : 0, record: best ? { name: 'Hip thrust', kg: best.kg, reps: best.reps } : null }
      const weekDone = s.weekDone.includes(today) ? s.weekDone : [...s.weekDone, today]
      const history = [{ id: `h${Date.now()}`, date: new Date().toISOString(), title: last.title, minutes: last.minutes, volume: last.volume, record: last.records, tone: 'training' }, ...s.history]
      return { session: null, lastSession: last, weekDone, history, firstSteps: { ...s.firstSteps, workout: true } }
    }),
    cancelWorkout: () => set({ session: null }),
    reset: () => { setState({ ...INITIAL }); notify('Volvimos al inicio', 'agua') },
  }), [set, notify])

  return <Ctx.Provider value={{ ...state, ...derived, ...actions, toast, notify, sheet, setSheet }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
