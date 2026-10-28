import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { START_MEALS, WEIGHTS } from './data'

const KEY = 'app-entrena-v1'
const INITIAL = {
  onboarded: false,
  name: 'Sofi',
  theme: 'auto', // auto | light | dark
  hideWeight: false,
  water: 1400, waterGoal: 2300,
  kcalGoal: 1850, protGoal: 110,
  sleep: 5, sleepGoal: 8,
  sessions: 1, sessionsGoal: 4,
  meals: START_MEALS,
  weights: WEIGHTS,
  planAdjusted: true,
  reminders: [
    { id: 'agua', title: 'Agua', detail: 'Cada 2 h, de 9:00 a 21:00', on: true },
    { id: 'entreno', title: 'Entrenamiento', detail: 'L a V a las 12:30', on: true },
    { id: 'comidas', title: 'Comidas', detail: 'Si no cargaste nada a las 15:00', on: false },
    { id: 'peso', title: 'Pesarte', detail: 'Domingos 8:00 · en ayunas', on: true },
    { id: 'dormir', title: 'Hora de dormir', detail: '23:30 · 8 h antes de tu alarma', on: true },
  ],
  goal: { type: 'Tonificar', target: 62, weeks: 8 },
}

const Ctx = createContext(null)

function load() {
  try { const s = localStorage.getItem(KEY); return s ? { ...INITIAL, ...JSON.parse(s) } : INITIAL } catch { return INITIAL }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const [sheet, setSheet] = useState(null) // 'add' | 'agua' | 'sueno' | null
  const t = useRef()

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* sin almacenamiento */ } }, [state])

  // tema: auto sigue al teléfono
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.theme === 'dark' || (state.theme === 'auto' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
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
    const kcal = state.meals.reduce((a, m) => a + m.kcal, 0)
    const prot = state.meals.reduce((a, m) => a + m.prot, 0)
    return { kcal, prot }
  }, [state.meals])

  const actions = useMemo(() => ({
    set,
    addWater: (ml) => { set((s) => ({ water: Math.min(s.waterGoal + 1500, s.water + ml) })); notify(`+${ml} ml registrados. ¡Bien ahí!`, 'agua') },
    addFood: (food, qty, meal) => {
      const k = Math.round(food.kcal * qty), p = Math.round(food.prot * qty)
      set((s) => {
        const meals = [...s.meals]
        const i = meals.findIndex((m) => m.meal === meal)
        if (i >= 0) meals[i] = { ...meals[i], desc: `${meals[i].desc}, ${food.name.toLowerCase()}`, kcal: meals[i].kcal + k, prot: meals[i].prot + p }
        else meals.push({ id: `m${Date.now()}`, meal, desc: food.name, kcal: k, prot: p, img: food.img })
        return { meals }
      })
      notify(`${food.name} agregado a la ${meal.toLowerCase()}`, 'comida')
    },
    setSleep: (h) => { set({ sleep: h }); notify(h >= 7 ? 'Descansaste bien. ¡A aprovecharlo!' : 'Anotado. Hoy vamos más tranqui.', 'descanso') },
    logWeight: (kg) => { set((s) => ({ weights: [...s.weights.slice(1), kg] })); notify('Peso guardado. Mirá la tendencia, no el número del día.', 'comida') },
    finishWorkout: () => set((s) => ({ sessions: Math.min(s.sessionsGoal, s.sessions + 1) })),
    reset: () => { setState({ ...INITIAL }); notify('Volvimos al inicio', 'agua') },
  }), [set, notify])

  return <Ctx.Provider value={{ ...state, ...derived, ...actions, toast, notify, sheet, setSheet }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
