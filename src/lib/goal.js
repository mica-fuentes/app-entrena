import { fmt } from './format'

/*
  Chequeo de realismo (SPEC §1.1). Nunca acepta un objetivo inseguro:
  - bajar: 0,5 a 0,7 kg por semana y nunca más del 1 % del peso por semana;
  - nunca por debajo de un peso saludable para la altura (IMC 18,5);
  - subir: hasta 0,5 % del peso por semana (más rápido suele ser grasa).
*/
export function checkGoal({ weight, height, target, weeks }) {
  const diff = +(target - weight).toFixed(1)
  const amount = Math.abs(diff)
  const w = Math.max(1, Math.round(weeks))
  if (amount < 0.5) return { kind: 'keep', ok: true, amount, weeks: w }

  if (diff < 0) {
    const minHealthy = 18.5 * (height / 100) ** 2
    if (target < minHealthy) return { kind: 'lose', ok: false, low: true, amount, weeks: w, minHealthy: Math.ceil(minHealthy) }
    const max = Math.min(0.7, weight * 0.01)
    const min = Math.min(0.5, max)
    const rate = amount / w
    const safeWeeks = Math.ceil(amount / ((min + max) / 2))
    return {
      kind: 'lose', ok: rate <= max + 0.001, amount, weeks: w, rate, pct: (rate / weight) * 100, min, max,
      safeWeeks, minWeeks: Math.ceil(amount / max), maxWeeks: Math.ceil(amount / min),
      inPlan: [Math.min(amount, min * w), Math.min(amount, max * w)],
    }
  }

  const max = Math.min(0.5, weight * 0.005)
  const min = max / 2
  const rate = amount / w
  return {
    kind: 'gain', ok: rate <= max + 0.001, amount, weeks: w, rate, pct: (rate / weight) * 100, min, max,
    safeWeeks: Math.ceil(amount / ((min + max) / 2)), minWeeks: Math.ceil(amount / max), maxWeeks: Math.ceil(amount / min),
    inPlan: [Math.min(amount, min * w), Math.min(amount, max * w)],
  }
}

// 8 → "2 meses", 3 → "3 semanas", 25 → "6 meses"
export const span = (weeks) => {
  if (weeks < 7) return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  const m = Math.round(weeks / 4.345)
  return `${m} ${m === 1 ? 'mes' : 'meses'}`
}

export const rangeKg = ([a, b]) => {
  const lo = Math.floor(a), hi = Math.round(b)
  return lo === hi ? `${fmt(lo)} kg` : `${fmt(lo)} a ${fmt(hi)} kg`
}

// Calorías y proteína (Mifflin-St Jeor). Si no hay sexo, usamos el promedio.
const ACT = { Poco: 1.35, Algo: 1.5, Mucho: 1.65 }
export function planNumbers({ weight, height, birth, sex, activity, goal, days = 4 }) {
  const age = Math.max(16, Math.floor((Date.now() - new Date(birth).getTime()) / 3.156e10)) || 25
  const base = 10 * weight + 6.25 * height - 5 * age
  const bmr = sex === 'Mujer' ? base - 161 : sex === 'Hombre' ? base + 5 : base - 78
  // la actividad diaria más los días de entrenamiento
  const tdee = Math.round((bmr * ((ACT[activity] || 1.5) + days * 0.025)) / 50) * 50
  const deficit = goal === 'Bajar grasa' ? 500 : goal === 'Tonificar' || goal === 'Todo a la vez' ? 450 : goal === 'Ganar músculo' ? -250 : 0
  const kcal = tdee - deficit
  const prot = Math.round((weight * 1.6) / 5) * 5
  return { tdee, deficit, kcal, prot }
}
