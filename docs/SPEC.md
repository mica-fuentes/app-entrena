# Especificación de la app

Prototipo navegable y animado de una app de **entrenamiento + alimentación** que te ayuda a llegar a tu objetivo **y te cuida en el camino**. Es un proyecto de portfolio de UX/UI: tiene que verse y sentirse como una app real terminada, en el celular y en la compu (en la compu se muestra dentro de un marco de teléfono).

- **Diseño de referencia (Figma):** https://www.figma.com/design/aSU909Jx8DJOAwTcRWPYJx
  - Páginas: `Onboarding`, `App — pantallas núcleo`, `App — flujos completos`, `App — flujos (modo oscuro)`, `Componentes`, `Imágenes`, `Brief`, `Portada portfolio`.
  - Si Figma está conectado, leé cada pantalla de ahí antes de programarla. Si no, esta especificación alcanza.
- **Nombre de la app:** provisorio, en `src/brand.js` (`APP_NAME`). Usalo siempre desde ahí; cuando se defina el nombre y el logo se cambia en un solo lugar. Dejá un lugar para el logo en la bienvenida y en el ícono de la app (por ahora, la gota).
- **Idioma:** español rioplatense con voseo ("Tocá", "Registrá", "entrenás"). Sin lenguaje con género cuando se puede evitar ("¿Arrancamos?" en vez de "¿Lista?").

---

## 1. Principios (no negociables)

1. **Cuidar antes que exigir.** La app nunca acepta un objetivo inseguro. Ejemplo: "bajar 15 kg en 2 meses" muestra "Esto no es factible de forma segura", calcula un plazo realista (0,5 a 0,7 kg por semana, nunca más del 1 % del peso por semana) y **no ofrece seguir con la meta original**: solo "Usar el plazo seguro" o "Elegir otra meta".
2. **Sin culpa.** No hay rachas que se pierden, rankings, mensajes de reto ni rojo de error para la comida. Si faltaste un día, no se pierde nada.
3. **La persona decide.** Cuando la app propone un ajuste (dormiste poco → una serie menos), siempre hay "Mantener mi plan".
4. **El peso no es la única métrica.** Se muestra como tendencia (promedio de 7 días). Las subidas de un día suelen ser agua. En recomposición, el peso puede no bajar y está bien: importan cintura, medidas y fuerza. Se puede **ocultar el número**.
5. **Recordar consultar a profesionales.** Molestias, lesiones o condiciones de salud: "La app sugiere alternativas, no diagnostica".
6. **Gratis antes de cobrar.** El plan completo es gratis. Pro suma lo que cuesta mantener (foto del plato con IA, ajuste semanal automático, análisis avanzado). "Nada de lo que hoy es gratis pasa a ser pago." Nunca un muro de pago después de la encuesta.

---

## 2. Sistema visual

Ya está en `src/styles.css` con los mismos valores que las variables de Figma. Usá siempre las variables CSS, nunca colores sueltos.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` | #F6F7FA | #121318 | Fondo de pantalla |
| `--surface` | #FFFFFF | #1C1D24 | Tarjetas |
| `--ink` | #16171D | #F2F3F7 | Texto principal, botones |
| `--muted` | #5E6272 | #A4A8B6 | Texto secundario |
| `--primary` / `--on-primary` | tinta / fondo | invertido | Botón principal |
| `--primary-soft` | #ECEEF5 | #262833 | Chips activos, fondos suaves |
| `--line` | #E3E5EC | #2E303A | Bordes y divisores |
| `--hero` | #E9EEFF | #1E2236 | Avisos de cuidado (celeste muy pálido) |
| `--training` / `-soft` | #2D5BFF / #DCE4FF | #6C8CFF / #1A2350 | Área Entrenar |
| `--food` / `-soft` | #FF6FAE / #FFE1EE | #FF8DC0 / #3A1B2A | Área Comida |
| `--water` / `-soft` | #22BFE0 / #D4F3FA | #5AD6F0 / #11303A | Agua |
| `--rest` / `-soft` | #B8E62E / #EEF8CC | #C8F04A / #283210 | Descanso y sueño |
| `--warn` / `--warn-soft` | #9A4F00 / #FFF3DF | #FFC15A / #3A2D14 | **Solo** avisos de cuidado |
| `--grad` | cobalto → #0A7DB5 | igual | Degradé para momentos destacados, siempre con texto blanco |

- **Ningún color de área es rojo, amarillo o verde de estado**: comer o descansar nunca se lee como error. La comida va en rosa.
- **Sin amarillo ni naranja de fondo.** A la diseñadora no le gustan.
- **Contraste:** todos los textos pasan 4,5:1 (está medido). El degradé termina en #0A7DB5 para que el texto blanco se lea.
- **Tipografía:** títulos y números en **Bricolage Grotesque Bold** (`.display`, `.num`); textos en **Inter** 400/500/600. No usar tamaños menores a 11 px.
- **Radios:** tarjetas 20–24 px, botones 16 px, chips en píldora.
- **Íconos:** de línea, 1,8 de grosor, en `src/components/Icons.jsx`. No usar emojis.
- **Modo oscuro:** completo. Por defecto sigue al teléfono y se puede forzar desde Perfil.

### Personajes (`src/components/Character.jsx`, ya programado)

Son la identidad de la app: "la mascota sin mascota". Cada forma es un dato del día y se llena según el progreso.

| Forma | Personaje | Color |
|---|---|---|
| `entreno` | pesa rusa | cobalto |
| `comida` | manzana (con tallito, sin hoja) | rosa |
| `agua` | gota | celeste |
| `descanso` | luna | lima |

- Props: `forma`, `expr` (`contento`, `energia`, `cansado`, `satisfecho`, `dormido`), `level` (0–100) y `size`.
- **Reglas:**
  - Reaccionan al estado del cuerpo, **nunca a si cumpliste**. Nunca tristes ni enojados.
  - Solo la luna duerme (`dormido`, con "z" flotando). El agua nunca duerme.
  - `cansado` = ojos relajados y gotita de esfuerzo.
- **Estilo:** color plano, contorno de tinta, sin colorete ni brillo (lo pidió la diseñadora).
- **Modo oscuro:** mantienen sus colores. Si el contorno se pierde sobre fondos oscuros, sumá un borde claro sutil alrededor, sin cambiar el estilo.
- **Animaciones ya incluidas:**
  - llenado con rebote (spring);
  - salto al cambiar de nivel;
  - parpadeo cada 5 a 7 s;
  - respiración suave;
  - "z" que flotan en la luna dormida;
  - gotita que cae en `cansado`.

---

## 3. Navegación

- **Barra inferior** fija en todas las pantallas de primer y segundo nivel: `Hoy · Entrenar · [+] · Comida · Progreso`. El estilo base está en `.nav` de `styles.css`.
  - **Pestaña activa:** ícono y texto en tinta, con un puntito del color del área debajo. Usá `layoutId` de framer-motion para que el puntito se deslice.
  - **Inactivas:** en gris.
- **Botón + central:** abre el **registro rápido** (hoja inferior) con Comida, Foto del plato (PRO), Escanear código de barras, Agua, Peso o medidas y Sueño.
- **Perfil:** se llega tocando el avatar con la inicial, arriba a la derecha en Hoy.
- **Sin barra de navegación** (modo foco o modal): onboarding, entrenamiento en curso, buscar alimento, porción, escanear, crear alimento, registrar peso o sueño.
- **Botón atrás:** chevron más el nombre de la pantalla anterior, arriba a la izquierda.
- **Router:** `HashRouter`, así funciona en GitHub Pages.

---

## 4. Pantallas

Datos de ejemplo en `src/data.js`. La persona de ejemplo es "Sofi", tonificar, 4 días por semana, molestia leve en la rodilla derecha. Todo lo que se registra se guarda en `localStorage` (ya armado en `src/store.jsx`).

### Onboarding (primera vez; después va directo a Hoy)
1. **Bienvenida**
   - Fondo `--hero`, los 4 personajes y dos píldoras: "Entrenás" y "Comés".
   - Título: "Tu objetivo, sin poner en riesgo tu salud."
   - Botón "Empezar" con el texto "gratis y no te pedimos tarjeta".
2. **Objetivo:** ganar músculo, tonificar, bajar grasa, todo a la vez o mantener (con descripción de cada uno).
3. **Cómo entrenás:** nivel, días por semana, tiempo por sesión y dónde (gimnasio, casa, ambos). Nota: "¿Tenés una rutina de tu profe? Después la cargás".
4. **Tus datos:** altura, peso, fecha de nacimiento y sexo para el cálculo (Mujer, Hombre o "Prefiero no decir"), más actividad diaria. Debe explicar por qué se pregunta.
5. **Molestias y lesiones:** zonas (rodilla, hombro, zona lumbar, cadera, muñeca, codo) e intensidad.
6. **Chequeo de realismo:** la persona escribe la meta (kg y semanas) y la app calcula **en vivo**.
   - Si no es factible: aviso de cuidado con la luna `cansado` y plazo seguro. Botones "Usar el plazo recomendado" y "Ajustar mi meta".
   - Si es factible: confirmación positiva.
7. **Tu plan está listo:** los 4 personajes en `satisfecho`, presentándose, y la lista de entrenamiento, proteína mínima, calorías, agua y sueño. Botón "Empezar gratis" con la nota "Sin tarjeta".
8. **Guardá tu plan:** crear cuenta con Apple, Google o mail, o "Ahora no". Es solo visual.
9. **¿Te avisamos?:** ejemplos de avisos con personajes. Botones "Activar avisos" y "Ahora no".

- Barra de progreso de 7 segmentos multicolor arriba.
- Transición entre pasos deslizando.
- Las opciones elegidas se marcan con borde de tinta.

### Hoy (pantalla principal)
- **Encabezado:** fecha chica, "Hola, Sofi" grande y avatar redondo con "S" (lleva a Perfil).
- **Aviso de cuidado** (tarjeta `--hero`): luna `dormido`, "Hoy, más tranqui" y "Dormiste 5 h: hacemos una serie menos por ejercicio". Links "Ver por qué" (lleva a Por qué ajustamos) y "Mantener mi plan".
  - Al mantener el plan, el aviso se cierra con animación y aparece un toast.
  - Este aviso aparece solo si el sueño es menor a 6 h.
- **Tu día:** grilla de 2×2, cada tarjeta con su color suave, su personaje (nivel según el dato real), valor grande y botón de acción.
  - Entreno: "1 de 4 entrenamientos esta semana".
  - Comida: "82 g de 110 g de proteína", botón "+ Comida".
  - Agua: "1,4 L de 2,3 L", botón "+ 250 ml" que suma al instante (el personaje se llena con rebote y aparece un toast).
  - Descanso: "5 h dormiste · meta 7 a 9 h", botón "Registrar".
  - Los números cambian con conteo animado.
- **Entrenamiento de hoy:** tarjeta con `--grad` y texto blanco. "Piernas y glúteos · 5 ejercicios · 45 min · cuidando tus rodillas", pesa rusa `energia` y botón blanco "Empezar".
- **Esta semana:** L a D en círculos; hechos en lima, hoy con borde de tinta y planificados en `--training-soft`. Texto "1 de 4 entrenamientos", **sin rachas**.

### Registro rápido (hoja del +)
- Lista con ícono o personaje, título y descripción.
- "Foto del plato" lleva el distintivo PRO.
- "Escanear código de barras" explica: "Del envase de un producto: carga calorías y macros solo".

### Agua (hoja)
- Gota grande con expresión `energia`.
- "1,65 L de 2,3 L", con botones "+250 ml", "+500 ml" y "Otra".
- Nota: "Hoy entrenás piernas: tu meta sube 0,4 L". Botón "Listo".

### Sueño (pantalla u hoja)
- Luna grande, "¿Cómo dormiste?" y un stepper de horas ("5 h 30") con la hora en que se acostó y se levantó.
- Calidad: Mal, Regular, Bien o Muy bien.
- Si fue poco: aviso "Dormir poco afecta tu rendimiento. Hoy te proponemos algo más liviano, podés aceptarlo o seguir con tu plan".

### Por qué ajustamos
- Tres razones, cada una con su personaje: dormiste 5 h 30 (tu promedio es 7 h), ayer hiciste piernas con mucho volumen y vas bien con el agua.
- "Qué cambia": una serie menos, mismo peso, mañana volvés a lo normal.
- Botones "Aplicar ajuste" y "Mantener mi plan".

### Entrenar
- **Inicio**
  - Rutina activa (tarjeta `--training-soft` con pesa rusa).
  - Mis rutinas (con miniaturas) y "+ Nueva".
  - Explorar: Ejercicios y Rutinas listas.
  - Acceso al historial.
- **Tu rutina (cobertura)**
  - "Bastante completa · 78 %, le faltan espalda alta e isquiotibiales".
  - Barras por músculo con la franja de referencia de 10 a 20 series. Las barras se animan al entrar.
  - Estado escrito ("Bien", "Bajo", "Sin trabajar"), no solo color.
  - Botón "Completar con 2 ejercicios": sugiere opciones que no cargan las rodillas.
- **Día de rutina:** chips (5 ejercicios · 45 min · Cuida la rodilla), entrada en calor, lista con fotos y botón "Empezar".
- **Entrenando** (modo foco, sin barra)
  - Arriba: "Terminar" y cronómetro corriendo de verdad. Barra de ejercicios.
  - Tarjeta del ejercicio con pesa rusa: nombre, "4 series · 8 a 10 reps · descanso 90 s", músculos y "Ver técnica".
  - Sugerencia: "La vez pasada 60 kg × 10. Hoy probá 62,5 kg".
  - Tabla de series (Serie, Anterior, Kg, Reps, ✓) con inputs editables. Al tocar ✓ la fila se completa con animación y **arranca el descanso**.
  - Descanso: cuenta regresiva real con "+15 s" y "Saltar"; vibra al terminar si el dispositivo lo permite.
  - "¿Te molesta algo? Cambiar por una alternativa" abre la hoja **Molestia**: zona, intensidad y 2 alternativas con foto. Por ejemplo, para hip thrust con rodilla: puente de glúteo con barra o pull-through en polea. Nota: "La app sugiere alternativas, no diagnostica".
  - Tarjeta "A continuación".
  - Al terminar el último ejercicio va a **Terminado**.
- **¡Listo por hoy!**
  - Encabezado con `--grad`; la pesa rusa entra con un rebote y hay un festejo de formas de colores (círculos, gotas, lunas pequeñas) volando, sin confeti genérico.
  - Volumen, series y récord (los números cuentan hacia arriba). Tarjeta "Nuevo récord".
  - "¿Cómo te sentiste?": Fácil, Justo o Muy exigente.
  - Tarjeta de comida: "Te faltan 28 g de proteína".
  - Suma 1 entrenamiento a la semana.
- **Historial:** tarjetas por fecha con volumen.
- **Progreso de un ejercicio:** mejor serie, barras semanales que crecen al entrar e historial.
- **Ejercicios (biblioteca):** buscador que filtra en vivo, chips de filtro (Glúteos, Cuida rodillas, Mancuernas, En casa, Máquinas, Principiante) y lista con foto, equipo, nivel y la etiqueta "Sin carga en rodilla".
- **Detalle del ejercicio**
  - Foto grande con botón de reproducir (el video es simulado).
  - Músculos, pasos numerados y aviso "Si te molesta la rodilla".
  - Alternativas reales: **para hip thrust son puente de glúteo, hip thrust en máquina, hip thrust a una pierna y pull-through en polea. La patada en polea NO es alternativa del hip thrust.**
  - Botón "Agregar a mi rutina".
- **Agregar ejercicios:** primero los músculos que te faltan, con selección múltiple (checkbox animado) y botón "Agregar 2 ejercicios".
- **Armar rutina:** nombre, días (círculos), pestañas Día 1 a 4 y lista de ejercicios con foto que se reordenan arrastrando (framer-motion `Reorder`). Debajo, "+ Agregar ejercicio" y la cobertura semanal en vivo.
- **Rutinas listas:** filtros y tarjetas con foto ("Cubre todos los músculos").

### Comida
- **Comida de hoy**
  - Resumen en `--food-soft` con la manzana: "1.420 kcal de 1.850" y barras de proteína (destacada en rosa), carbohidratos y grasas.
  - Chips: Buscar, Escanear, Repetir ayer, Foto del plato · Pro.
  - Comidas del día con foto (Desayuno, Almuerzo, Merienda y Cena "+ Agregar").
  - Sugerencia: "Te faltan 28 g de proteína. Para la cena: huevos, atún o lentejas".
  - Link "Cómo calculamos tus números".
- **Buscar alimento:** filtro en vivo con pestañas (Resultados, Recientes, Mis comidas) y botón + en cada fila.
  - **Sin resultados:** manzana `cansado`, "No lo encontramos", "Crear …" y parecidos.
- **Porción**
  - Foto, stepper de gramos y unidades (1 pote, 100 g, cucharada).
  - Macros que se recalculan en vivo.
  - Tarjeta con la manzana: "Con esto llegás a 99 de 110 g".
  - Selector de comida y botón "Agregar a la cena": suma de verdad y vuelve con toast.
- **Escanear código:** pantalla oscura con visor y línea que sube y baja animada. Explicación: "Escaneá el código de barras del envase: cargamos el producto con sus calorías y macros". El resultado aparece después de unos segundos (simulado).
- **Foto del plato (PRO):** foto del plato, "Esto es lo que vemos" (aparece con un escaneo animado), ítems con "≈" y "Editar", y total. Distintivo "Te quedan 3 fotos de prueba".
- **Detalle de comida:** foto, ingredientes editables, total con la manzana y "Guardar como comida frecuente".
- **Crear alimento:** campos de nombre, porción, calorías y macros.
- **Tus números, explicados:** gasto estimado 2.300 − déficit 450 = 1.850; proteína 1,6 g/kg = 110 g; límites ("nunca más del 1 % por semana") y "Son estimaciones, consultá con un profesional".

### Progreso
- **Progreso**
  - Selector Mes, 3 meses o Año.
  - Gráfico de peso: puntos de los pesajes y una **línea de tendencia que se dibuja al entrar**. 67,1 kg con "−0,9 kg en 12 semanas" y explicación.
  - Si "ocultar número" está activo: solo "bajando, estable o subiendo".
  - Tarjetas de cintura (−2 cm) y cadera (+1,5 cm).
  - Tarjeta "Tu peso casi no cambió, y está bien".
  - "Más fuerte": Hip thrust de 50 a 62,5 kg.
  - Accesos a Fotos, Tu mes y Revisión semanal.
- **Registrar peso:** stepper (67,4 kg), aviso "Pesate a la mañana, en ayunas…" y el interruptor "Ocultar el número".
- **Medidas:** cintura, cadera, muslo y brazo con la diferencia desde el inicio.
- **Fotos:** grilla privada ("solo en tu teléfono") y **Comparar** con un deslizador antes/después que funciona arrastrando.
  - Usar siluetas o ilustración, **nunca cuerpos reales**.
- **Tu mes:** calendario (entrenaste en cobalto, dormiste poco con un punto lima) y "Sin rachas: si faltás un día, no perdés nada". Datos: días por semana, días con proteína y sueño promedio.
- **Revisión semanal (PRO, domingo):** encabezado con degradé y personajes, resumen de la semana, propuesta ("Mantener calorías", "Dormir 30 minutos más") y botones "Aplicar propuesta" y "Dejar todo como está".

### Perfil
- Avatar, nombre y objetivo.
- **Tu plan:** objetivo, datos del cuerpo, molestias y lesiones, días y tiempo.
- **App:** recordatorios, modo oscuro (Auto, Claro u Oscuro), ocultar números y unidades.
- **Cuenta:** tu plan (Gratis → Ver Pro), privacidad y ayuda.
- **Editar objetivo:** mismo chequeo de realismo que en el onboarding, más la tarjeta "¿5 kilos de qué?".
- **Molestias y lesiones:** por cada zona, qué evitamos y qué te damos; el interruptor "Avisarme si un ejercicio carga esta zona"; y "Cargá las indicaciones de tu kinesiólogo/a".
- **Recordatorios**
  - Cada uno con interruptor y **lápiz para editar** (fino, gris, sin fondo), más "+ Nuevo recordatorio".
  - Las ediciones se abren en una hoja:
    - Entrenamiento: días y hora, por ejemplo de lunes a viernes a las 12:30.
    - Agua: cada 40 min, 1, 2 o 3 h, entre dos horarios.
    - Pesarte: día, a la mañana y **siempre en ayunas** (explicado).
    - Hora de dormir: acostarse y levantarse, de 7 a 9 h.
  - Nota: "Nunca te mandamos mensajes de culpa."
- **Pro**
  - Encabezado cobalto y tabla Gratis/Pro.
  - Precio "$ X.XXX por mes": es un placeholder, dejalo así.
  - "Probar 7 días gratis, sin tarjeta", "Seguir con Gratis" y el compromiso.
- **Privacidad:** datos de salud como datos sensibles (Ley 25.326), interruptores, descargar mis datos y borrar cuenta.
- **Pausa:** vacaciones, no me siento bien, lesión u otra razón, con duración. Pausa metas y avisos sin perder nada.

### Estados
- **Primer día:** personajes vacíos (nivel 25) y checklist de primeros pasos.
- **Sin conexión:** gota `contento` (no dormida), "Podés seguir: guardamos todo y sincronizamos después".
- Toasts de confirmación arriba, con el personaje que corresponde.

---

## 5. Animación e interactividad (la diseñadora pidió MUCHA)

Usá **framer-motion** (ya instalado). Todo con propósito, rápido y con `prefers-reduced-motion` respetado (ya hay una regla global en el CSS).

| Momento | Animación |
|---|---|
| Cambio de pantalla | Deslizar 24 px + fundido, 250 ms; ir para atrás desliza al revés |
| Entrada de contenido | Tarjetas en cascada (stagger de 40 ms, y: 12 → 0) |
| Personajes | Llenado con resorte, salto al cambiar, parpadeo, respiración y "z" (ya hecho) |
| Números | Conteo animado al cambiar (kcal, litros, kg, volumen) |
| Barras de progreso | Crecen desde 0 al entrar (resorte suave) |
| Botones y tarjetas | `whileTap={{ scale: 0.97 }}` |
| Hojas inferiores | Suben con resorte, se cierran arrastrando hacia abajo, fondo con fundido |
| Barra de navegación | Puntito activo con `layoutId` que se desliza |
| Botón + | Gira 45° y se vuelve × cuando la hoja está abierta |
| Checks de series | El círculo se llena en lima con un pequeño rebote; la fila se atenúa |
| Descanso | Anillo o barra de cuenta regresiva que se vacía |
| Gráfico de peso | La línea se dibuja (`pathLength` de 0 a 1) |
| Terminado | La pesa rusa entra con rebote y un festejo con formas de la marca |
| Escanear | Línea de escaneo que sube y baja |
| Foto del plato | Barrido de escaneo sobre la foto y los ítems aparecen uno a uno |
| Toast | Entra desde arriba con resorte y se va solo a los 2,4 s |
| Aviso de cuidado | Al tocar "Mantener mi plan" se colapsa con animación de altura |

---

## 6. Imágenes

- **Ya están en `public/img/`:**
  - Ejercicios: `hip`, `puente`, `rdl`, `abd`, `bulgara`, `pull`.
  - Comida: `plato`, `yogur`, `desayuno`, `merienda`.
- **Faltan** (está la lista en la página Imágenes de Figma): más ejercicios para la biblioteca y portadas de rutinas listas.
  - Mientras tanto, usá las existentes o un placeholder con el color suave del área y el personaje.
  - No uses imágenes de internet sin licencia.

## 7. Técnica

- Vite + React 19 + framer-motion + react-router-dom (HashRouter). JavaScript, no TypeScript.
- Estructura sugerida: `src/screens/<Área>/<Pantalla>.jsx`, `src/components/` (Nav, Sheet, Toast, Button, Chip, Toggle, Stepper, Bar, AnimatedNumber, Back, Header…).
- Estado global en `src/store.jsx` (Context + localStorage); ampliarlo según haga falta.
- Mobile first. En la compu, marco de teléfono de 390×844 (ya está en `.device`).
- Accesibilidad:
  - botones reales (`<button>`, `<a>`), `aria-label` en los botones de solo ícono;
  - foco visible y áreas táctiles de 44 px o más;
  - `alt` en las fotos.
- Deploy: `.github/workflows/deploy.yml` publica en GitHub Pages en cada push a `main`.

---

## 8. Adaptación a pantallas y control de calidad (obligatorio)

El Figma es la **referencia de diseño, no un plano para copiar al píxel**. Está dibujado a 390×844. La app tiene que verse bien en cualquier teléfono y, si una medida del Figma no funciona en pantalla real, se ajusta con criterio de diseño.

### Adaptación
- **Probar como mínimo en:** 360×740 (Android chico), 375×667 (iPhone SE), 390×844 (referencia), 430×932 (iPhone grande). En la compu, el marco de teléfono.
- **Anchos fluidos:** nada de anchos fijos en px para contenedores. Márgenes laterales de 16 a 24 px con `clamp()`.
- **Títulos grandes con `clamp()`**, para que en pantallas chicas no ocupen media pantalla. Ejemplo: `clamp(26px, 8vw, 32px)`.
- **Alturas:** usá `100dvh`, no `100vh` (en el celular la barra del navegador corta la pantalla). Sin alturas fijas en tarjetas con texto: que crezcan con el contenido.
- **Zonas seguras:** respetá `env(safe-area-inset-top/bottom)` en el encabezado, la barra de navegación y las hojas inferiores, así nada queda debajo del notch ni de la barra de inicio.
- **Grillas:** la de 2×2 de Hoy y las de números pasan a una columna, o achican el contenido, si no entran. Nunca desbordan para el costado.
- **Chips y filtros:** si no entran, scroll horizontal con la última pastilla cortada en el borde para que se entienda que hay más. Nunca cortados a mitad de pantalla.
- **Imágenes** con `aspect-ratio` y `object-fit: cover`. **Personajes** escalados según el ancho disponible.

### Scroll
- **Un solo scroll vertical por pantalla**, nunca un scroll adentro de otro.
- **La barra de navegación y los botones de acción principales quedan fijos.** El contenido tiene padding inferior suficiente para que el último elemento no quede tapado.
- **Hojas inferiores:** altura máxima del 88 % y scroll propio si el contenido es largo. Mientras están abiertas, el fondo no scrollea.
- **Sin rebotes raros** ni saltos de layout al cargar (reservá espacio para imágenes y números).
- **Al cambiar de pantalla, el scroll vuelve arriba.** Al volver para atrás, se recupera donde estaba.
- **Con el teclado abierto** (buscar, editar peso, crear alimento), el campo activo y el botón de guardar tienen que seguir visibles.

### Proporciones y legibilidad (lo que suele salir mal al copiar del Figma)
- **Si algo se ve sobredimensionado** en el teléfono real (títulos, personajes, tarjetas, botones), achicalo con criterio. La jerarquía es más importante que la medida exacta.
- **Mínimos de lectura:**
  - texto corrido de 14 a 16 px;
  - textos secundarios desde 12 px;
  - etiquetas muy chicas, nunca menos de 11 px.
  - **Nunca se achica la letra para que algo "entre"**: se reorganiza el layout.
- **Áreas táctiles de 44×44 px como mínimo**, aunque el ícono sea más chico.
- **Contraste de 4,5:1 en texto**, también en modo oscuro y sobre los degradés.
- **Espaciado consistente** en una escala de 4 (4, 8, 12, 16, 20, 24, 32).

### Autocontrol: hacelo vos, sin esperar que Mica lo marque
Antes de dar por terminada cada etapa:
1. Sacá capturas de cada pantalla en los 4 tamaños, en claro y oscuro (Playwright o el navegador que tengas).
2. Mirá las capturas como diseñador/a y buscá:
   - textos cortados o en una sola palabra por renglón;
   - desbordes horizontales y elementos superpuestos;
   - cosas tapadas por la barra de navegación;
   - tamaños desproporcionados;
   - contrastes flojos;
   - viudas en títulos;
   - scroll doble.
3. Si tenés skills de diseño o de UI instaladas, usalas para revisar.
4. Corregí todo lo que encuentres y volvé a capturar. Anotá en `docs/DECISIONES.md` qué ajustaste respecto del Figma y por qué.
