// Números y fechas en español de Argentina: "1.420", "1,4", "martes 20 de octubre".
const cache = {}
const nf = (max, min) => (cache[`${max}-${min}`] ??= new Intl.NumberFormat('es-AR', { maximumFractionDigits: max, minimumFractionDigits: min }))

export const fmt = (n, max = 0, min = 0) => nf(max, min).format(n)
export const liters = (ml) => fmt(ml / 1000, 2, 1)
export const kg = (n) => fmt(n, 1)
export const signed = (n, max = 1) => (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n), max)

// 5.5 → "5 h 30"; 7 → "7 h"
export const hours = (h) => {
  const H = Math.floor(h)
  const m = Math.round((h - H) * 60)
  return m ? `${H} h ${String(m).padStart(2, '0')}` : `${H} h`
}

// Hora "23:30" ± minutos → "0:00"
export const addMinutes = (hhmm, min) => {
  const [h, m] = hhmm.split(':').map(Number)
  const t = (((h * 60 + m + min) % 1440) + 1440) % 1440
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

export const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
export const DAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
export const DAY_SHORT = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
export const weekday = (d = new Date()) => (d.getDay() + 6) % 7 // 0 = lunes
export const longDate = (d = new Date()) => cap(`${DAY_NAMES[weekday(d)]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`)
export const shortDate = (d) => `${cap(DAY_NAMES[weekday(d)])} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
export const daysAgo = (n) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return d }

// Lista "a, b y c" (con "e" antes de "i": "espalda alta e isquiotibiales")
export const joinY = (arr) => {
  if (arr.length < 2) return arr.join('')
  const last = arr[arr.length - 1]
  return `${arr.slice(0, -1).join(', ')} ${/^h?i[^aeou]/i.test(last) ? 'e' : 'y'} ${last}`
}

// "a la cena", "al almuerzo"
export const toMeal = (meal) => (meal === 'Cena' || meal === 'Merienda' ? `a la ${meal.toLowerCase()}` : `al ${meal.toLowerCase()}`)

// Días elegidos → "L, M, J y S"
export const daysLabel = (idx) => {
  const s = [...idx].sort((a, b) => a - b)
  if (s.length === 7) return 'Todos los días'
  if (s.length === 5 && s.every((d, i) => d === i)) return 'L a V'
  return joinY(s.map((i) => DAYS[i]))
}
