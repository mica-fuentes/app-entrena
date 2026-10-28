const img = (n) => `${import.meta.env.BASE_URL}img/${n}.jpg`

export const EXERCISES = {
  bulgara: { id: 'bulgara', name: 'Sentadilla búlgara', img: img('bulgara'), muscle: 'Glúteos y cuádriceps', equip: 'Mancuernas y banco', level: 'Intermedio', knee: false,
    steps: ['Apoyá el empeine de atrás en el banco.', 'Bajá en vertical hasta que el muslo de adelante quede paralelo al piso.', 'Empujá con el talón de adelante para subir.', 'Hacé todas las repeticiones de un lado y cambiá.'],
    alts: ['Estocada estática', 'Step-up al banco'] },
  hip: { id: 'hip', name: 'Hip thrust con barra', img: img('hip'), muscle: 'Glúteos', equip: 'Barra y banco', level: 'Intermedio', knee: true,
    steps: ['Apoyá la espalda alta en el banco, a la altura de los omóplatos.', 'Pies al ancho de cadera; arriba, las rodillas quedan a 90°.', 'Empujá con los talones y apretá glúteos arriba, sin arquear la zona lumbar.', 'Bajá controlando, 2 a 3 segundos.'],
    alts: ['Puente de glúteo', 'Hip thrust en máquina', 'Hip thrust a una pierna', 'Pull-through en polea'], kneeTip: 'Alejá un poco los pies del banco: baja la carga sobre la rodilla.' },
  rdl: { id: 'rdl', name: 'Peso muerto rumano', img: img('rdl'), muscle: 'Isquios y glúteos', equip: 'Mancuernas', level: 'Intermedio', knee: true,
    steps: ['Parate con las mancuernas adelante de los muslos.', 'Llevá la cadera hacia atrás con la espalda recta y las rodillas apenas flexionadas.', 'Bajá hasta sentir el estiramiento atrás del muslo.', 'Volvé empujando la cadera hacia adelante.'],
    alts: ['Pull-through en polea', 'Extensión de cadera a 45°'] },
  abd: { id: 'abd', name: 'Abducción en máquina', img: img('abd'), muscle: 'Glúteo medio', equip: 'Máquina', level: 'Principiante', knee: true,
    steps: ['Sentate con la espalda apoyada.', 'Abrí las piernas empujando con la parte externa de las rodillas.', 'Pausá un segundo afuera.', 'Volvé despacio.'],
    alts: ['Abducción con banda', 'Caminata lateral con banda'] },
  pull: { id: 'pull', name: 'Pull-through en polea', img: img('pull'), muscle: 'Glúteos e isquios', equip: 'Polea con soga', level: 'Principiante', knee: true,
    steps: ['De espaldas a la polea baja, la soga entre las piernas.', 'Llevá la cadera hacia atrás con la espalda recta.', 'Extendé la cadera apretando glúteos.', 'Las rodillas casi no se mueven.'],
    alts: ['Peso muerto rumano', 'Hip thrust con barra'] },
  puente: { id: 'puente', name: 'Puente de glúteo con banda', img: img('puente'), muscle: 'Glúteos', equip: 'Banda', level: 'Principiante', knee: true,
    steps: ['Acostate boca arriba, rodillas flexionadas y banda arriba de las rodillas.', 'Empujá con los talones y subí la cadera.', 'Abrí un poco las rodillas contra la banda.', 'Bajá controlando.'],
    alts: ['Hip thrust con barra', 'Puente a una pierna'] },
}

export const DAY = {
  title: 'Piernas y glúteos',
  minutes: 45,
  items: [
    { id: 'bulgara', sets: 3, reps: '10 por pierna', rest: 60, last: [[20, 10], [20, 10], [20, 9]] },
    { id: 'hip', sets: 4, reps: '8 a 10', rest: 90, last: [[60, 10], [60, 10], [60, 9], [57.5, 10]], suggest: 62.5 },
    { id: 'rdl', sets: 3, reps: '10', rest: 90, last: [[16, 10], [16, 10], [16, 10]] },
    { id: 'abd', sets: 3, reps: '15', rest: 45, last: [[40, 15], [40, 15], [40, 14]] },
    { id: 'pull', sets: 3, reps: '12', rest: 60, last: [[25, 12], [25, 12], [25, 12]] },
  ],
}

export const MUSCLES = [
  { name: 'Glúteos', sets: 16 },
  { name: 'Cuádriceps', sets: 12 },
  { name: 'Hombros', sets: 11 },
  { name: 'Pecho', sets: 8 },
  { name: 'Isquiotibiales', sets: 4 },
  { name: 'Espalda alta', sets: 0 },
]

export const FOODS = [
  { id: 'yogur-griego', name: 'Yogur griego natural', portion: '1 pote', grams: 170, kcal: 100, prot: 17, carb: 6, fat: 0, img: img('yogur') },
  { id: 'yogur-bebible', name: 'Yogur bebible de vainilla', portion: '1 vaso', grams: 200, kcal: 150, prot: 6, carb: 24, fat: 3 },
  { id: 'yogur-proteico', name: 'Yogur proteico', portion: '1 pote', grams: 160, kcal: 110, prot: 15, carb: 9, fat: 1 },
  { id: 'huevo', name: 'Huevo', portion: '1 unidad', grams: 50, kcal: 72, prot: 6, carb: 0, fat: 5 },
  { id: 'atun', name: 'Atún al natural', portion: '1 lata', grams: 120, kcal: 130, prot: 28, carb: 0, fat: 1 },
  { id: 'pollo', name: 'Pollo a la plancha', portion: '1 porción', grams: 120, kcal: 200, prot: 37, carb: 0, fat: 5 },
  { id: 'lentejas', name: 'Lentejas cocidas', portion: '1 taza', grams: 200, kcal: 230, prot: 18, carb: 40, fat: 1 },
  { id: 'arroz', name: 'Arroz blanco cocido', portion: '1 taza', grams: 150, kcal: 195, prot: 4, carb: 43, fat: 0 },
  { id: 'banana', name: 'Banana', portion: '1 unidad', grams: 120, kcal: 105, prot: 1, carb: 27, fat: 0 },
  { id: 'avena', name: 'Avena', portion: '1/2 taza', grams: 40, kcal: 150, prot: 5, carb: 27, fat: 3 },
  { id: 'milanesa-soja', name: 'Milanesa de soja', portion: '1 unidad', grams: 90, kcal: 190, prot: 13, carb: 18, fat: 7 },
  { id: 'queso', name: 'Queso cremoso', portion: '1 feta', grams: 30, kcal: 90, prot: 6, carb: 0, fat: 7 },
]

export const START_MEALS = [
  { id: 'm1', meal: 'Desayuno', desc: 'Yogur, avena y banana', kcal: 380, prot: 22, img: img('desayuno') },
  { id: 'm2', meal: 'Almuerzo', desc: 'Pollo, arroz y ensalada', kcal: 640, prot: 45, img: img('plato') },
  { id: 'm3', meal: 'Merienda', desc: 'Tostadas con queso', kcal: 400, prot: 15, img: img('merienda') },
]

// 42 pesajes de ejemplo: tendencia de 68 a 67,1 kg
export const WEIGHTS = (() => {
  let s = 7
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: 42 }, (_, i) => +(68 - 0.9 * (i / 41) + (rnd() - 0.5) * 1.1 + (i % 7 === 5 ? 0.35 : 0)).toFixed(1))
})()

export const IMG = { plato: img('plato'), hip: img('hip') }
