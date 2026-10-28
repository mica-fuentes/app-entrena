import { EXERCISES, MUSCLE_LIST } from '../data'
import { joinY } from './format'

// Series semanales por músculo. Referencia general: 10 a 20 series por semana.
export function coverage(plan) {
  const acc = Object.fromEntries(MUSCLE_LIST.map((m) => [m, 0]))
  plan.flat().forEach((p) => {
    const w = EXERCISES[p.id]?.work || {}
    for (const m in w) if (m in acc) acc[m] += w[m] * p.sets
  })
  const rows = MUSCLE_LIST.map((name) => {
    const sets = Math.round(acc[name])
    return { name, sets, status: sets === 0 ? 'Sin trabajar' : sets < 10 ? 'Bajo' : sets > 20 ? 'Mucho' : 'Bien' }
  })
  const pct = Math.round((rows.reduce((a, r) => a + Math.min(r.sets, 10) / 10, 0) / rows.length) * 100)
  const missing = rows.filter((r) => r.sets < 6).sort((a, b) => a.sets - b.sets)
  const label = pct >= 90 ? 'Muy completa' : pct >= 65 ? 'Bastante completa' : 'Le falta bastante'
  const lower = (n) => n.charAt(0).toLowerCase() + n.slice(1)
  const text = missing.length ? `Le faltan ${joinY(missing.map((r) => lower(r.name)))}.` : 'Cubre todos los músculos.'
  return { rows, pct, missing, label, text }
}

// Ejercicios que conviene sumar: primero los músculos que faltan y que no cargan la rodilla
export function suggestions(plan, { knee = true } = {}) {
  const { missing } = coverage(plan)
  const inPlan = new Set(plan.flat().map((p) => p.id))
  const muscles = missing.map((m) => m.name)
  return Object.values(EXERCISES)
    .filter((e) => !inPlan.has(e.id) && e.muscles.some((m) => muscles.includes(m)) && (!knee || e.knee))
    .sort((a, b) => muscles.indexOf(a.muscles.find((m) => muscles.includes(m))) - muscles.indexOf(b.muscles.find((m) => muscles.includes(m))))
}

// El día de la rutina donde mejor entra un ejercicio (misma zona del cuerpo, el más corto)
export function bestDay(plan, id) {
  const region = EXERCISES[id].region
  let best = 0, score = Infinity
  plan.forEach((day, i) => {
    const same = day.filter((p) => EXERCISES[p.id]?.region === region).length
    const sc = (same >= day.length / 2 ? 0 : 100) + day.length
    if (day.length === 0 || sc < score) { best = i; score = day.length === 0 ? -1 : sc }
  })
  return best
}
