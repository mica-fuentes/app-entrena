import { FOODS, MEAL_NAMES } from '../../data'

// A qué comida se suma: la que pide la URL, la primera vacía del día o la que toca por la hora
export function pickMeal(q, meals) {
  const m = q.get('comida')
  if (MEAL_NAMES.includes(m)) return m
  const empty = MEAL_NAMES.find((n) => !meals.some((x) => x.meal === n && x.items.length))
  if (empty) return empty
  const h = new Date().getHours()
  return h < 11 ? 'Desayuno' : h < 15 ? 'Almuerzo' : h < 19 ? 'Merienda' : 'Cena'
}

export const findFood = (id, custom = []) => [...custom, ...FOODS].find((f) => f.id === id)
export const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export const portionText = (f) => (/\d+\s?(g|ml)\)?$/.test(f.portion) ? f.portion : `${f.portion} (${f.grams} g)`)
