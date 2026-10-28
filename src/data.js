import { daysAgo } from './lib/format'

const img = (n) => `${import.meta.env.BASE_URL}img/${n}.jpg`

/*
  Ejercicios. `knee: true` = sin carga en rodilla. `work` = cuánto cuenta cada serie
  para cada músculo (para la cobertura semanal). Los que no tienen foto muestran
  un placeholder con el color del área (SPEC §6).
*/
const E = (o) => ({ img: null, home: false, machine: false, dumbbell: false, alts: [], steps: [], ...o })

export const EXERCISES = {
  bulgara: E({ id: 'bulgara', name: 'Sentadilla búlgara', img: img('bulgara'), muscle: 'Glúteos y cuádriceps', muscles: ['Cuádriceps', 'Glúteos'], equip: 'Mancuernas y banco', level: 'Intermedio', knee: false, dumbbell: true, home: true, region: 'lower',
    work: { Cuádriceps: 1, Glúteos: 0.5 }, kg: 20,
    steps: ['Apoyá el empeine de atrás en el banco.', 'Bajá en vertical hasta que el muslo de adelante quede paralelo al piso.', 'Empujá con el talón de adelante para subir.', 'Hacé todas las repeticiones de un lado y cambiá.'],
    alts: ['estocada', 'goblet'], kneeTip: 'Bajá menos profundo y dejá la rodilla de adelante sobre el tobillo, sin pasarse de la punta del pie.' }),
  hip: E({ id: 'hip', name: 'Hip thrust con barra', img: img('hip'), muscle: 'Glúteos', muscles: ['Glúteos', 'Isquios', 'Core'], equip: 'Barra y banco', level: 'Intermedio', knee: true, region: 'lower',
    work: { Glúteos: 1 }, kg: 60,
    steps: ['Apoyá la espalda alta en el banco, a la altura de los omóplatos.', 'Pies al ancho de cadera; cuando subís, las rodillas quedan a 90°.', 'Empujá con los talones y apretá glúteos arriba, sin arquear la zona lumbar.', 'Bajá controlando, 2 a 3 segundos.'],
    alts: ['puente', 'hip-maquina', 'hip-una', 'pull'], kneeTip: 'Alejá un poco los pies del banco: baja la carga sobre la rodilla.' }),
  rdl: E({ id: 'rdl', name: 'Peso muerto rumano', img: img('rdl'), muscle: 'Isquios y glúteos', muscles: ['Isquiotibiales', 'Glúteos'], equip: 'Mancuernas', level: 'Intermedio', knee: true, dumbbell: true, home: true, region: 'lower',
    work: { Isquiotibiales: 1, Glúteos: 0.5 }, kg: 16,
    steps: ['Parate con las mancuernas adelante de los muslos.', 'Llevá la cadera hacia atrás con la espalda recta y las rodillas apenas flexionadas.', 'Bajá hasta sentir el estiramiento atrás del muslo.', 'Volvé empujando la cadera hacia adelante.'],
    alts: ['pull', 'ext-cadera', 'curl-fem'] }),
  abd: E({ id: 'abd', name: 'Abducción en máquina', img: img('abd'), muscle: 'Glúteo medio', muscles: ['Glúteos'], equip: 'Máquina', level: 'Principiante', knee: true, machine: true, region: 'lower',
    work: { Glúteos: 0.5 }, kg: 40,
    steps: ['Sentate con la espalda apoyada.', 'Abrí las piernas empujando con la parte externa de las rodillas.', 'Pausá un segundo afuera.', 'Volvé despacio.'],
    alts: ['abd-banda'] }),
  pull: E({ id: 'pull', name: 'Pull-through en polea', img: img('pull'), muscle: 'Glúteos e isquios', muscles: ['Glúteos', 'Isquiotibiales'], equip: 'Polea con soga', level: 'Principiante', knee: true, machine: true, region: 'lower',
    work: { Glúteos: 0.5, Isquiotibiales: 0.3 }, kg: 25,
    steps: ['De espaldas a la polea baja, la soga entre las piernas.', 'Llevá la cadera hacia atrás con la espalda recta.', 'Extendé la cadera apretando glúteos.', 'Las rodillas casi no se mueven.'],
    alts: ['rdl', 'hip'] }),
  puente: E({ id: 'puente', name: 'Puente de glúteo con banda', img: img('puente'), muscle: 'Glúteos', muscles: ['Glúteos'], equip: 'Banda', level: 'Principiante', knee: true, home: true, region: 'lower',
    work: { Glúteos: 1 }, kg: 0,
    steps: ['Acostate boca arriba, rodillas flexionadas y banda arriba de las rodillas.', 'Empujá con los talones y subí la cadera.', 'Abrí un poco las rodillas contra la banda.', 'Bajá controlando.'],
    alts: ['hip', 'puente-barra', 'hip-una'] }),
  'puente-barra': E({ id: 'puente-barra', name: 'Puente de glúteo con barra', img: img('puente'), muscle: 'Glúteos', muscles: ['Glúteos'], equip: 'Barra', level: 'Principiante', knee: true, region: 'lower',
    work: { Glúteos: 1 }, kg: 50,
    steps: ['Acostate en el piso con la barra sobre la cadera (usá una almohadilla).', 'Rodillas flexionadas y pies apoyados cerca de los glúteos.', 'Subí la cadera apretando glúteos.', 'Bajá controlando hasta casi tocar el piso.'],
    alts: ['hip', 'puente', 'hip-maquina'] }),
  'hip-maquina': E({ id: 'hip-maquina', name: 'Hip thrust en máquina', muscle: 'Glúteos', muscles: ['Glúteos'], equip: 'Máquina', level: 'Principiante', knee: true, machine: true, region: 'lower',
    work: { Glúteos: 1 }, kg: 50,
    steps: ['Ajustá el respaldo a la altura de los omóplatos.', 'Pies apoyados al ancho de cadera.', 'Empujá con los talones hasta alinear rodillas, cadera y hombros.', 'Bajá en 2 segundos.'],
    alts: ['hip', 'puente-barra', 'hip-una'] }),
  'hip-una': E({ id: 'hip-una', name: 'Hip thrust a una pierna', muscle: 'Glúteos', muscles: ['Glúteos', 'Core'], equip: 'Banco', level: 'Intermedio', knee: true, home: true, region: 'lower',
    work: { Glúteos: 1 }, kg: 0,
    steps: ['Espalda alta en el banco y una pierna levantada.', 'Empujá con el talón que queda apoyado.', 'Subí sin rotar la cadera.', 'Hacé todas las repeticiones y cambiá de lado.'],
    alts: ['hip', 'puente', 'hip-maquina'] }),
  patada: E({ id: 'patada', name: 'Patada de glúteo en polea', muscle: 'Glúteos', muscles: ['Glúteos'], equip: 'Polea', level: 'Principiante', knee: true, machine: true, region: 'lower',
    work: { Glúteos: 0.7 }, kg: 10,
    steps: ['Tobillera en la polea baja y manos apoyadas adelante.', 'Llevá la pierna hacia atrás sin arquear la zona lumbar.', 'Apretá el glúteo un segundo arriba.', 'Volvé despacio.'],
    alts: ['abd', 'abd-banda'] }),
  'ext-cadera': E({ id: 'ext-cadera', name: 'Extensión de cadera a 45°', muscle: 'Glúteos e isquios', muscles: ['Glúteos', 'Isquiotibiales'], equip: 'Banco a 45°', level: 'Principiante', knee: true, machine: true, region: 'lower',
    work: { Glúteos: 0.7, Isquiotibiales: 0.7 }, kg: 0,
    steps: ['Apoyá la cadera en el borde del banco.', 'Bajá el torso con la espalda recta.', 'Subí apretando glúteos hasta quedar en línea.', 'No te arquees arriba.'],
    alts: ['rdl', 'pull'] }),
  'curl-fem': E({ id: 'curl-fem', name: 'Curl femoral acostado', muscle: 'Isquiotibiales', muscles: ['Isquiotibiales'], equip: 'Máquina', level: 'Principiante', knee: false, machine: true, region: 'lower',
    work: { Isquiotibiales: 1 }, kg: 25,
    steps: ['Acostate boca abajo con el rodillo arriba de los talones.', 'Flexioná las rodillas llevando los talones hacia los glúteos.', 'Pausá arriba.', 'Bajá en 3 segundos.'],
    alts: ['rdl', 'ext-cadera'] }),
  goblet: E({ id: 'goblet', name: 'Sentadilla goblet', muscle: 'Cuádriceps y glúteos', muscles: ['Cuádriceps', 'Glúteos'], equip: 'Mancuerna', level: 'Principiante', knee: false, dumbbell: true, home: true, region: 'lower',
    work: { Cuádriceps: 1, Glúteos: 0.5 }, kg: 14,
    steps: ['Sostené la mancuerna contra el pecho.', 'Bajá con el pecho alto, rodillas en la línea de los pies.', 'Bajá hasta donde puedas sin molestias.', 'Subí empujando todo el pie.'],
    alts: ['bulgara', 'estocada'], kneeTip: 'Sentate en un banco alto como tope: limita la profundidad.' }),
  estocada: E({ id: 'estocada', name: 'Estocada estática', muscle: 'Cuádriceps y glúteos', muscles: ['Cuádriceps', 'Glúteos'], equip: 'Mancuernas', level: 'Principiante', knee: false, dumbbell: true, home: true, region: 'lower',
    work: { Cuádriceps: 1, Glúteos: 0.5 }, kg: 10,
    steps: ['Un pie adelante y otro atrás, separados.', 'Bajá en vertical las dos rodillas.', 'Subí empujando con el pie de adelante.', 'Cambiá de lado.'],
    alts: ['bulgara', 'goblet'] }),
  'abd-banda': E({ id: 'abd-banda', name: 'Abducción con banda', muscle: 'Glúteo medio', muscles: ['Glúteos'], equip: 'Banda', level: 'Principiante', knee: true, home: true, region: 'lower',
    work: { Glúteos: 0.5 }, kg: 0,
    steps: ['Banda arriba de las rodillas, sentado o de costado.', 'Abrí las rodillas contra la banda.', 'Pausá un segundo.', 'Volvé despacio.'],
    alts: ['abd'] }),
  'press-hombro': E({ id: 'press-hombro', name: 'Press de hombros con mancuernas', muscle: 'Hombros', muscles: ['Hombros'], equip: 'Mancuernas', level: 'Intermedio', knee: true, dumbbell: true, home: true, region: 'upper',
    work: { Hombros: 1 }, kg: 8,
    steps: ['Sentate con la espalda apoyada y las mancuernas a la altura de los hombros.', 'Empujá hacia arriba sin arquear la espalda.', 'Bajá hasta la altura de las orejas.', 'Exhalá al subir.'],
    alts: ['elev-lat'] }),
  'elev-lat': E({ id: 'elev-lat', name: 'Elevaciones laterales', muscle: 'Hombros', muscles: ['Hombros'], equip: 'Mancuernas', level: 'Principiante', knee: true, dumbbell: true, home: true, region: 'upper',
    work: { Hombros: 1 }, kg: 5,
    steps: ['Parate con las mancuernas al costado.', 'Subí los brazos hacia los costados hasta la altura de los hombros.', 'Codos apenas flexionados.', 'Bajá despacio.'],
    alts: ['press-hombro', 'face-pull'] }),
  flexiones: E({ id: 'flexiones', name: 'Flexiones de brazos', muscle: 'Pecho', muscles: ['Pecho', 'Hombros'], equip: 'Sin equipo', level: 'Principiante', knee: true, home: true, region: 'upper',
    work: { Pecho: 1, Hombros: 0.5 }, kg: 0,
    steps: ['Manos un poco más abiertas que los hombros.', 'Cuerpo en línea, de la cabeza a los talones.', 'Bajá el pecho hasta cerca del piso.', 'Si cuesta, apoyá las rodillas.'],
    alts: ['press-pecho'] }),
  'press-pecho': E({ id: 'press-pecho', name: 'Press de pecho con mancuernas', muscle: 'Pecho', muscles: ['Pecho', 'Hombros'], equip: 'Mancuernas y banco', level: 'Principiante', knee: true, dumbbell: true, region: 'upper',
    work: { Pecho: 1 }, kg: 12,
    steps: ['Acostate en el banco con las mancuernas sobre el pecho.', 'Bajá hasta que los codos queden un poco por debajo del banco.', 'Empujá hacia arriba.', 'Omóplatos juntos todo el tiempo.'],
    alts: ['flexiones'] }),
  remo: E({ id: 'remo', name: 'Remo con mancuerna', muscle: 'Espalda alta', muscles: ['Espalda alta'], equip: 'Mancuerna y banco', level: 'Principiante', knee: true, dumbbell: true, home: true, region: 'upper',
    work: { 'Espalda alta': 1 }, kg: 14,
    steps: ['Apoyá una mano y una rodilla en el banco.', 'Tirá la mancuerna hacia la cadera.', 'Juntá el omóplato arriba.', 'Bajá estirando el brazo.'],
    alts: ['jalon', 'face-pull'] }),
  jalon: E({ id: 'jalon', name: 'Jalón al pecho', muscle: 'Espalda alta', muscles: ['Espalda alta'], equip: 'Máquina', level: 'Principiante', knee: true, machine: true, region: 'upper',
    work: { 'Espalda alta': 1 }, kg: 35,
    steps: ['Agarrá la barra un poco más abierto que los hombros.', 'Bajala hacia el pecho llevando los codos hacia abajo.', 'Pecho alto, sin balancearte.', 'Subí controlando.'],
    alts: ['remo'] }),
  'face-pull': E({ id: 'face-pull', name: 'Face pull en polea', muscle: 'Espalda alta y hombros', muscles: ['Espalda alta', 'Hombros'], equip: 'Polea con soga', level: 'Principiante', knee: true, machine: true, region: 'upper',
    work: { 'Espalda alta': 0.7, Hombros: 0.5 }, kg: 15,
    steps: ['Polea a la altura de la cara, soga con las dos manos.', 'Tirá hacia la frente abriendo los codos.', 'Juntá los omóplatos.', 'Volvé despacio.'],
    alts: ['remo', 'elev-lat'] }),
}

export const LIBRARY_ORDER = ['hip', 'puente', 'rdl', 'patada', 'abd', 'pull', 'hip-maquina', 'hip-una', 'puente-barra', 'ext-cadera', 'abd-banda', 'bulgara', 'goblet', 'estocada', 'curl-fem', 'remo', 'jalon', 'face-pull', 'press-hombro', 'elev-lat', 'flexiones', 'press-pecho']

export const MUSCLE_LIST = ['Glúteos', 'Cuádriceps', 'Hombros', 'Pecho', 'Isquiotibiales', 'Espalda alta']

// Lo que hiciste la vez pasada (para "Anterior" y la sugerencia de carga)
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

const it = (id, sets, reps, rest) => ({ id, sets, reps, rest })
export const START_ROUTINES = [
  {
    id: 'r1', name: 'Piernas & torso', by: 'Cargada por vos', img: img('hip'), days: [0, 1, 3, 5],
    titles: ['Piernas y glúteos', 'Torso', 'Glúteos y piernas', 'Torso y core'],
    plan: [
      DAY.items.map((x) => it(x.id, x.sets, x.reps, x.rest)),
      [it('press-hombro', 3, '10', 75), it('flexiones', 3, '8 a 12', 60), it('elev-lat', 3, '12 a 15', 45)],
      [it('goblet', 4, '10', 75), it('hip-maquina', 3, '10', 75), it('estocada', 4, '10 por pierna', 60), it('abd-banda', 3, '15', 45)],
      [it('press-pecho', 3, '10', 75), it('flexiones', 2, '10', 60), it('press-hombro', 2, '10', 75)],
    ],
  },
  {
    id: 'r2', name: 'Full body 3 días', by: 'Armada por la app', img: img('bulgara'), days: [0, 2, 4],
    titles: ['Full body A', 'Full body B', 'Full body C'],
    plan: [
      [it('goblet', 3, '10', 75), it('remo', 3, '10', 60), it('hip', 3, '10', 90), it('press-hombro', 3, '10', 60), it('curl-fem', 3, '12', 60)],
      [it('rdl', 3, '10', 90), it('jalon', 3, '10', 60), it('estocada', 3, '10', 60), it('press-pecho', 3, '10', 75), it('face-pull', 3, '15', 45)],
      [it('bulgara', 3, '10', 60), it('remo', 3, '10', 60), it('puente-barra', 3, '12', 75), it('flexiones', 3, '10', 60), it('elev-lat', 3, '15', 45)],
    ],
  },
]

export const READY_ROUTINES = [
  { id: 'lista-full', name: 'Full body 3 días', desc: 'Todo el cuerpo · 45 min · principiante', img: img('hip'), tone: 'training', tags: ['Tonificar', '3 días', 'Gimnasio', 'Principiante'], base: 'r2' },
  { id: 'lista-gluteos', name: 'Glúteos y piernas + torso', desc: '3 días · 55 min · intermedio', img: img('puente'), tone: 'food', tags: ['Tonificar', '3 días', 'Gimnasio'], base: 'r1' },
  { id: 'lista-casa', name: 'En casa con mancuernas', desc: '3 días · 40 min · poco equipo', img: img('rdl'), tone: 'water', tags: ['Tonificar', '3 días', 'En casa', 'Principiante'], base: 'r2' },
  { id: 'lista-fuerza', name: 'Fuerza 4 días', desc: '4 días · 60 min · intermedio', img: img('bulgara'), tone: 'rest', tags: ['Ganar músculo', '4 días', 'Gimnasio'], base: 'r1' },
]

// Alimentos (por porción)
export const FOODS = [
  { id: 'yogur-griego', name: 'Yogur griego natural', note: 'Sin azúcar agregada', portion: '1 pote', grams: 170, kcal: 100, prot: 17, carb: 6, fat: 0, img: img('yogur'), extra: [['1 cucharada', 15], ['Taza', 245]] },
  { id: 'yogur-bebible', name: 'Yogur bebible de vainilla', portion: '1 vaso', grams: 200, kcal: 150, prot: 6, carb: 24, fat: 3 },
  { id: 'yogur-entero', name: 'Yogur entero natural', portion: '1 pote', grams: 125, kcal: 80, prot: 4, carb: 6, fat: 4 },
  { id: 'yogur-granola', name: 'Yogur con granola', portion: '1 pote', grams: 165, kcal: 210, prot: 7, carb: 30, fat: 6 },
  { id: 'yogur-proteico', name: 'Yogur proteico', portion: '1 pote', grams: 160, kcal: 110, prot: 15, carb: 9, fat: 1 },
  { id: 'huevo', name: 'Huevo', portion: '1 unidad', grams: 50, kcal: 72, prot: 6, carb: 0, fat: 5 },
  { id: 'atun', name: 'Atún al natural', portion: '1 lata', grams: 120, kcal: 130, prot: 28, carb: 0, fat: 1 },
  { id: 'pollo', name: 'Pollo a la plancha', portion: '1 porción', grams: 120, kcal: 200, prot: 37, carb: 0, fat: 5 },
  { id: 'lentejas', name: 'Lentejas cocidas', portion: '1 taza', grams: 200, kcal: 230, prot: 18, carb: 40, fat: 1 },
  { id: 'arroz', name: 'Arroz blanco cocido', portion: '1 taza', grams: 150, kcal: 195, prot: 4, carb: 43, fat: 0 },
  { id: 'banana', name: 'Banana', portion: '1 unidad', grams: 120, kcal: 105, prot: 1, carb: 27, fat: 0 },
  { id: 'manzana', name: 'Manzana', portion: '1 unidad', grams: 180, kcal: 95, prot: 0, carb: 25, fat: 0 },
  { id: 'avena', name: 'Avena', portion: '1/2 taza', grams: 40, kcal: 150, prot: 5, carb: 27, fat: 3 },
  { id: 'milanesa-soja', name: 'Milanesa de soja (envasada)', portion: '1 unidad', grams: 90, kcal: 190, prot: 13, carb: 18, fat: 7 },
  { id: 'milanesa-pollo', name: 'Milanesa de pollo al horno', portion: '1 unidad', grams: 130, kcal: 230, prot: 24, carb: 14, fat: 8 },
  { id: 'queso', name: 'Queso cremoso', portion: '1 feta', grams: 30, kcal: 90, prot: 6, carb: 0, fat: 7 },
  { id: 'ricota', name: 'Ricota descremada', portion: '2 cucharadas', grams: 60, kcal: 70, prot: 7, carb: 3, fat: 3 },
  { id: 'leche', name: 'Leche descremada', portion: '1 vaso (200 ml)', grams: 200, kcal: 70, prot: 7, carb: 10, fat: 0 },
  { id: 'pan-integral', name: 'Pan integral', portion: '1 rodaja', grams: 30, kcal: 75, prot: 3, carb: 13, fat: 1 },
  { id: 'palta', name: 'Palta', portion: '1/2 unidad', grams: 70, kcal: 115, prot: 1, carb: 6, fat: 10 },
  { id: 'garbanzos', name: 'Garbanzos cocidos', portion: '1 taza', grams: 160, kcal: 270, prot: 15, carb: 45, fat: 4 },
  { id: 'tofu', name: 'Tofu firme', portion: '1 porción', grams: 100, kcal: 145, prot: 15, carb: 3, fat: 8 },
  { id: 'fideos', name: 'Fideos cocidos', portion: '1 plato', grams: 200, kcal: 310, prot: 11, carb: 62, fat: 2 },
  { id: 'carne', name: 'Carne magra a la plancha', portion: '1 porción', grams: 120, kcal: 210, prot: 32, carb: 0, fat: 9 },
  { id: 'tarta', name: 'Tarta de verdura', portion: '1 porción', grams: 180, kcal: 330, prot: 12, carb: 30, fat: 18 },
]

// Comidas del día. Cada una suma sus ingredientes.
const ing = (name, amount, kcal, prot, carb, fat) => ({ id: `${name}-${amount}`, name, amount, kcal, prot, carb, fat })
export const START_MEALS = [
  { id: 'm1', meal: 'Desayuno', time: '8:30', source: 'buscador', desc: 'Yogur, avena y banana', img: img('desayuno'),
    items: [ing('Yogur griego natural', '170 g', 100, 17, 6, 0), ing('Avena', '50 g', 190, 4, 33, 4), ing('Banana', '1/2 unidad', 90, 1, 23, 0)] },
  { id: 'm2', meal: 'Almuerzo', time: '13:20', source: 'foto del plato', desc: 'Pollo, arroz y ensalada', img: img('plato'),
    items: [ing('Arroz blanco', '150 g', 195, 4, 43, 0), ing('Pollo a la plancha', '150 g', 250, 40, 0, 10), ing('Ensalada de hojas y tomate', '80 g', 20, 1, 4, 0), ing('Aceite de oliva', '1 cucharada', 120, 0, 0, 14), ing('Pan', '1 rodaja', 55, 0, 11, 4)] },
  { id: 'm3', meal: 'Merienda', time: '17:00', source: 'buscador', desc: 'Tostadas con queso', img: img('merienda'),
    items: [ing('Tostadas integrales', '2 unidades', 190, 5, 34, 3), ing('Queso cremoso', '2 fetas', 180, 10, 2, 13), ing('Mate cocido', '1 taza', 30, 0, 4, 0)] },
]
export const MEAL_NAMES = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena']
export const YESTERDAY_DINNER = { desc: 'Tarta de verdura y ensalada', items: [ing('Tarta de verdura', '1 porción', 330, 12, 30, 18), ing('Ensalada', '1 plato', 60, 2, 8, 3)] }

// Foto del plato (simulada)
export const PLATE_GUESS = [
  { name: 'Arroz blanco', grams: 150, per: { kcal: 1.3, prot: 0.027, carb: 0.29, fat: 0 } },
  { name: 'Pollo a la plancha', grams: 120, per: { kcal: 1.67, prot: 0.31, carb: 0, fat: 0.04 } },
  { name: 'Ensalada de hojas', grams: 80, per: { kcal: 0.25, prot: 0.01, carb: 0.05, fat: 0 } },
]

// 42 pesajes de ejemplo: tendencia de 68 a 67,1 kg
export const WEIGHTS = (() => {
  let s = 7
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: 42 }, (_, i) => +(68 - 0.9 * (i / 41) + (rnd() - 0.5) * 1.1 + (i % 7 === 5 ? 0.35 : 0)).toFixed(1))
})()

// Un año para la vista "Año": antes de las 12 semanas, el peso estaba más arriba
export const WEIGHTS_YEAR = (() => {
  let s = 3
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  const before = Array.from({ length: 110 }, (_, i) => +(70.4 - 2.4 * (i / 109) + (rnd() - 0.5) * 1.2).toFixed(1))
  return [...before, ...WEIGHTS]
})()

export const MEASURES = [
  { id: 'cintura', name: 'Cintura', start: 73, now: 71 },
  { id: 'cadera', name: 'Cadera', start: 98, now: 99.5 },
  { id: 'muslo', name: 'Muslo', start: 57, now: 58 },
  { id: 'brazo', name: 'Brazo', start: 29, now: 29 },
]

// Historial: fechas relativas a hoy para que el prototipo siempre se vea al día
export const START_HISTORY = [
  { id: 'h1', date: daysAgo(2).toISOString(), title: 'Torso', minutes: 52, volume: 6100, record: 0, tone: 'water' },
  { id: 'h2', date: daysAgo(5).toISOString(), title: 'Piernas y glúteos', minutes: 45, volume: 8050, record: 0, tone: 'training' },
  { id: 'h3', date: daysAgo(7).toISOString(), title: 'Torso y core', minutes: 41, volume: 5200, record: 0, tone: 'water' },
  { id: 'h4', date: daysAgo(9).toISOString(), title: 'Glúteos y piernas', minutes: 50, volume: 7400, record: 1, tone: 'food' },
  { id: 'h5', date: daysAgo(12).toISOString(), title: 'Piernas y glúteos', minutes: 47, volume: 7900, record: 0, tone: 'training' },
  { id: 'h6', date: daysAgo(16).toISOString(), title: 'Full body', minutes: 40, volume: 5900, record: 0, tone: 'rest' },
]

// Mejor serie de hip thrust por semana (12 semanas)
export const HIP_WEEKS = [50, 50, 52.5, 52.5, 55, 55, 55, 57.5, 57.5, 60, 60, 62.5]
export const HIP_LOG = [
  { d: 0, sets: '62,5 kg × 8 · 62,5 × 8 · 62,5 × 7' },
  { d: 5, sets: '60 kg × 10 · 60 × 9 · 60 × 9' },
  { d: 12, sets: '60 kg × 9 · 60 × 9 · 57,5 × 10' },
]

export const IMG = { plato: img('plato'), hip: img('hip'), yogur: img('yogur') }
