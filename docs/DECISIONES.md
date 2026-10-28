# Decisiones tomadas durante la programación

Claude Code anota acá lo que decidió por su cuenta (porque no estaba en la spec), para que Mica lo revise al final.

| Pantalla / tema | Decisión | Por qué |
|---|---|---|
| Marco de compu | El `.device` pasó a 410 × 864 px para que la pantalla de adentro mida 390 × 844 (el borde de 10 px quedaba adentro y comía 20 px). | La spec pide un marco de 390 × 844, igual que el Figma. |
| Medidas fluidas | Márgenes y títulos con `clamp()` en unidades `cqi` (ancho del teléfono) en vez de `vw`. | Dentro del marco de compu `vw` mide la ventana y no el teléfono; con `cqi` se ve igual en el celular y en el marco. |
| Barra de estado | En la compu se dibuja una barra de estado "9:41" falsa; en el celular solo queda una franja del alto del notch. En pantallas con encabezado de color (Terminado, Pro, Revisión, Escanear) va adentro de la pantalla y scrollea con ella. | Que en el portfolio se vea como un teléfono real, sin que el texto choque con el notch en el celular. |
| Entrada de contenido | La cascada de 40 ms se hizo con CSS (`.screen > *`) y no envolviendo cada bloque en framer-motion. | Mismo efecto, menos código y se apaga solo con `prefers-reduced-motion`. |
| Transiciones | Entre pestañas de la barra, la dirección del deslizamiento sigue el orden de las pestañas (Hoy → Comida desliza a la izquierda; Comida → Hoy, a la derecha). | Refuerza el modelo espacial de la barra. |
| Registro rápido (+) | La hoja del + se abre **encima** de la barra, no tapándola. | La spec pide que el + gire y se vuelva ×; si la hoja tapaba la barra, el × no se veía. |
| Hoy · tarjetas del día | Si la tarjeta mide menos de 164 px (teléfonos de 360 y 375), el botón de acción ("+ Comida", "+ 250 ml", "Registrar") baja al pie de la tarjeta en lugar de ir arriba a la derecha. | Arriba a la derecha pisaba al personaje. Se reorganiza en vez de achicar la letra. |
| Hoy · botones chicos | Los botones de las tarjetas se ven de 36 px de alto pero tienen un área táctil invisible de 46 px. | Mantener la proporción del Figma y cumplir los 44 px táctiles. |
| Sueño | El dato de ejemplo pasó de 5 h a **5 h 30** en toda la app. | El Figma mostraba 5 h en Hoy y 5 h 30 en Sueño y en "Por qué ajustamos": unifiqué. |
| Sueño | El aviso "Dormir poco afecta tu rendimiento" usa el fondo `--hero` (celeste pálido) y no el crema del Figma. | El crema se lee como naranja; `--hero` es el color de los avisos de cuidado y la diseñadora pidió nada de amarillo/naranja de fondo. El crema (`--warn-soft`) quedó solo para avisos de seguridad (meta insegura, dolor, borrar cuenta). |
| Hoy · fecha | La fecha y la semana usan el día real (hoy) en vez de "Martes 20 de octubre". El historial y el calendario también se arman relativos a hoy. | Que el prototipo nunca se vea desactualizado cuando alguien lo abra desde el portfolio. |
| Hoy · Empezar | "Empezar" en la tarjeta de entrenamiento arranca directamente el entrenamiento en curso. Si ya hay uno empezado dice "Seguir entrenando", y si ya entrenaste hoy, "Ver tu entrenamiento". | Menos pasos para la acción principal del día. |
| Ajuste por sueño | El ajuste (una serie menos) viene aplicado por defecto si dormiste menos de 6 h; "Mantener mi plan" lo saca y cierra el aviso. Al registrar más de 6 h, el aviso desaparece solo. | Coincide con el texto del aviso ("hacemos una serie menos") y con el principio "la persona decide". |
| Entrenar · datos | Sumé 16 ejercicios a la biblioteca (22 en total) con músculos, equipo, nivel, si cargan la rodilla y alternativas reales. Los que no tienen foto muestran el placeholder con el color del área y la pesa rusa. | La spec pide más ejercicios para la biblioteca; las fotos faltan (lista en la página Imágenes de Figma). |
| Entrenar · cobertura | La cobertura se calcula en vivo con las series de la rutina: cada ejercicio suma series a sus músculos (el principal cuenta 1 y los secundarios, menos). El % es el promedio de cuánto se acerca cada músculo a 10 series. Por eso da 70 % y no 78 %. | Que el número cambie de verdad al agregar o quitar ejercicios (y en Armar rutina). |
| Entrenar · cobertura | Las barras de "Bajo" usan el amarillo de cuidado (`--caution`) solo en la barra, con el texto en `--warn`. Nunca de fondo. | Como en el Figma, sin usar amarillo de fondo. |
| Entrenar · Tu rutina | Sumé la lista "Días" con acceso a cada día de la rutina y "Editar" arriba a la derecha (lleva a Armar rutina). | Faltaba cómo llegar al día 2, 3 y 4. |
| Entrenar · ajuste | Si el ajuste por sueño está aplicado, cada ejercicio tiene una serie menos (mínimo 2) y el día muestra el chip "Una serie menos". | Que el ajuste propuesto en Hoy se vea en el entrenamiento real. |
| Entrenando | "Terminar" abre una hoja de confirmación ("Terminar y guardar", "Seguir entrenando" o descartar). Cuando completás todas las series aparece "Siguiente: …" y, en el último ejercicio, "Terminar entrenamiento". | Evitar terminar sin querer y dar un cierre claro a cada ejercicio. |
| Entrenando | La pesa rusa cambia de cara según el momento: `energia` mientras hacés la serie, `cansado` (con la gotita) durante el descanso y `satisfecho` al completar el ejercicio. | Que reaccione al estado del cuerpo, nunca a si cumpliste. |
| Entrenando | La sesión se guarda en el estado: si recargás la página, seguís donde estabas y el cronómetro no se reinicia. Tocando los segmentos de arriba o "A continuación" podés saltar entre ejercicios. | Que se sienta como una app real. |
| Molestia | Las alternativas salen de las alternativas del ejercicio que no cargan la zona elegida. Para hip thrust con rodilla son exactamente "puente de glúteo con barra" y "pull-through en polea". Si la intensidad es "Fuerte", en vez de alternativas aparece "Mejor frená por hoy" con "Terminar por hoy". | Principio "cuidar antes que exigir" y "la app sugiere alternativas, no diagnostica". |
| ¡Listo por hoy! | Si terminás sin completar ninguna serie, se muestran los números de referencia del diseño (8.420 kg, 18 series, 1 récord) para que la demo no muestre ceros. Si hiciste series, se muestran tus números reales. | Que el prototipo luzca bien en una demo rápida sin mentir cuando hay datos. |
| ¡Listo por hoy! | "¿Cómo te sentiste?" responde con un toast distinto si elegís "Muy exigente" ("La próxima vamos un poco más suave"). | Mostrar que la respuesta se usa. |
| Detalle de ejercicio | El video es simulado: el botón de play muestra una barra de progreso de 0:42 que avanza de verdad. Si el ejercicio ya está en tu rutina, el botón pasa a "Ya está en tu rutina · Ver día N". | La spec pide video simulado. |
| Historial | Cada entrenamiento abre una hoja con su resumen, y arriba hay un acceso a "Más fuerte: hip thrust" (progreso del ejercicio). | En el Figma las tarjetas tenían chevron pero no había a dónde ir. |
| Armar rutina | "+ Nueva" arranca con una copia de la rutina activa como base. El borrador se guarda en el estado para no perderlo al ir a "Agregar ejercicios". Se puede cambiar el nombre de cada día. | Igual que en el Figma (que muestra la rutina cargada) y menos trabajo para la persona. |
| Rutinas listas | Los filtros van en una fila con scroll horizontal. Cada rutina abre una vista previa con sus días y "Usar esta rutina". | Los filtros ocupaban tres renglones en 360 px. |
| Comida · comidas del día | Cada comida muestra kcal arriba a la derecha y la proteína debajo, en dos renglones, en vez de "380 kcal · 22 g prot." en una sola línea. | En 360 px la descripción quedaba cortada a la mitad. |
| Comida · a qué comida se suma | Si no se elige, se suma a la primera comida vacía del día (en el ejemplo, la cena); si están todas cargadas, a la que corresponde por la hora. | Coincide con el Figma ("Agregar a la cena") y con el uso real. |
| Comida · ingredientes | Cada comida guarda sus ingredientes con calorías y macros, y los totales del día salen de ahí (1.420 kcal · 82 g de proteína, igual que el Figma). En el detalle, el lápiz abre una hoja para ajustar la cantidad (× 0,25 a × 4) o quitar el ingrediente. | La spec pide ingredientes editables. |
| Comida · Repetir ayer | Suma la cena de ayer (tarta de verdura y ensalada) a la cena de hoy. El chip desaparece si la cena ya está cargada. | No estaba definido qué repetía. |
| Comida · sugerencia de proteína | Debajo de "Te faltan 28 g de proteína" hay accesos directos a huevos, atún y lentejas. | Llevar de la sugerencia a la acción en un toque. |
| Buscar alimento | Sumé "Escanear" al final de las pestañas, como en el Figma, y "Mis comidas" muestra los alimentos creados y las comidas guardadas como frecuentes. | Que "Guardar como comida frecuente" y "Crear alimento" tengan dónde aparecer. |
| Porción | El selector de comida pasó a una fila con scroll horizontal con el título "¿A qué comida lo sumamos?". Al agregar, vuelve a Comida de hoy saltando buscar y porción, con toast. | Los cuatro chips no entraban en una línea. |
| Escanear | La pantalla es oscura siempre (también en modo claro). Encuentra "Leche descremada" a los 2,6 s; también se puede escribir el código a mano. | La spec pide resultado simulado después de unos segundos. |
| Foto del plato | Cada foto guardada descuenta una de las 3 de prueba. Sin fotos de prueba y sin Pro, la pantalla explica por qué es Pro y ofrece seguir gratis con el buscador (nunca un muro). | Principio "gratis antes de cobrar". |
| Crear alimento | Sumé el campo "Gramos de la porción" para poder recalcular macros en Porción. Al guardar, abre la porción del alimento nuevo. | Sin los gramos no se podía usar el stepper de gramos. |
| Progreso · gráfico | La línea es el promedio de los últimos 7 pesajes y se dibuja al entrar y al cambiar de período (Mes = últimos 12 pesajes, 3 meses = 42, Año = un año de datos de ejemplo). El último punto de la tendencia aparece en lima con un rebote. | La spec pide tendencia de 7 días y línea que se dibuja. |
| Progreso · ocultar número | Con "Ocultar el número" activo, el peso se reemplaza por "Bajando", "Estable" o "Subiendo" en Progreso, Registrar peso, Comparar y la Revisión semanal. | Principio 4: el peso no es la única métrica. |
| Progreso · "Tu peso casi no cambió" | La tarjeta aparece solo si la tendencia se movió menos de 1,5 kg en el período. | Que el mensaje sea verdad con los datos que se ven. |
| Progreso · accesos | Sumé "+ Registrar" en la tarjeta de peso y una lista con Fotos, Medidas, Tu mes y Revisión semanal (con distintivo Pro). | La spec pide accesos a Fotos, Tu mes y Revisión. |
| Fotos | Las fotos de ejemplo son siluetas ilustradas cuya cintura se angosta semana a semana. "Sacar foto de hoy" suma una silueta "Hoy" (simulado) y avisa que queda solo en el teléfono. | Nunca cuerpos reales. |
| Comparar | El deslizador hace un vaivén corto al entrar para mostrar que se puede arrastrar; también funciona con las flechas del teclado. | Descubrimiento del gesto y accesibilidad. |
| Tu mes | El calendario es del mes actual: marca como entrenados los días de la rutina (salteando alguno, porque pasa y está bien) y los del historial. Los días con un punto lima son los que dormiste poco. | Que siempre se vea al día. |
| Revisión semanal | "Aplicar propuesta" mueve de verdad el recordatorio de dormir 30 minutos antes. Sin Pro se ve igual, con una nota "Estás viendo una muestra de Pro". | Que la propuesta tenga un efecto visible y que Pro no sea un muro. |
| Perfil · modo oscuro | Control segmentado Auto / Claro / Oscuro en vez del interruptor del Figma. | La spec pide las tres opciones. |
| Perfil · sección "Prototipo" | Sumé accesos a Primer día, Sin conexión, Avisos en el teléfono y "Volver a empezar" (borra los datos y abre el onboarding). | Para mostrar los estados en el portfolio sin tocar el código. |
| Perfil · Ayuda y Unidades | Ayuda abre una hoja con tres preguntas frecuentes y "Escribirnos"; Unidades muestra kg, cm, kcal y litros (solo sistema métrico por ahora). | No estaban diseñadas. |
| Objetivo · chequeo de realismo | Es el mismo componente que en el onboarding. Además del ritmo (0,5 a 0,7 kg por semana y nunca más del 1 % del peso), frena metas por debajo de un peso saludable para la altura (IMC 18,5): ahí no ofrece plazo, solo "Elegir otra meta". Para subir de peso, el tope es 0,5 % por semana. "Guardar objetivo" solo aparece cuando la meta es segura. | Principio 1: nunca aceptar una meta insegura. |
| Objetivo · campos | Meta de peso y plazo son steppers en filas a lo ancho (± 0,5 kg y ± 1 semana) en vez de dos cajas lado a lado. | En 360 px el número se partía en dos renglones. |
| Objetivo · "Elegir otra meta" | Propone una meta alcanzable en el plazo elegido (al ritmo máximo seguro) para que la persona la ajuste. | Que el botón haga algo concreto. |
| Objetivo · "¿5 kilos de qué?" | El título usa los kilos reales de la meta ("¿15,4 kilos de qué?"). | Que el mensaje coincida con lo que la persona escribió. |
| Datos del cuerpo y Días | Al guardar se recalculan las calorías (Mifflin-St Jeor según actividad y días de entrenamiento) y la proteína (1,6 g/kg). Con los datos de Sofi da 2.300 − 450 = 1.850 kcal y 110 g, como la spec. | Que los números de Comida salgan del cálculo explicado. |
| Molestias | Cada zona se edita en una hoja (zona, intensidad y desde cuándo); "Ya no me molesta" la quita. Las indicaciones del kinesiólogo/a se cargan como texto. Con intensidad "Fuerte" aparece el aviso de consultar. | La spec pide qué evitamos y qué damos por zona. |
| Recordatorios | Se editan en hojas (como pide la spec, el Figma los mostraba como pantallas). "+ Nuevo recordatorio" ofrece Estirar, Tomar creatina, Preparar la vianda o uno propio. El aviso de pesarte explica "siempre en ayunas" con fondo `--hero`. | Sin fondos crema/naranja. |
| Pro | Encabezado cobalto plano (no degradé), tabla Gratis/Pro y precio placeholder. "Probar 7 días gratis" activa Pro en el prototipo y se puede volver a Gratis sin perder nada. | Lo pide la spec. |
| Privacidad | "Descargar mis datos" descarga de verdad un JSON con lo guardado en el teléfono. "Borrar mi cuenta" pide confirmación, explica los 30 días y vuelve al onboarding. | Que se pueda probar. |
| Pausa | Al pausar, Hoy muestra una tarjeta "Estás en pausa hasta…" con "Volver ahora", y se oculta el aviso de sueño. Si el motivo es una lesión, sugiere consultar antes de volver. | "Pausa metas y avisos sin perder nada". |
| Onboarding | Los 9 pasos de la spec en una sola pantalla con transición deslizando (y al revés al volver con la flecha). La barra de 7 segmentos se llena con el color de cada paso; Guardá tu plan y ¿Te avisamos? no la muestran, como en el Figma. | La spec pide barra de 7 segmentos y transición deslizando. |
| Onboarding · bienvenida | Arriba hay un lugar para el logo (por ahora, la gota) con el nombre de `brand.js`. Sumé el link "Ver la app con datos de ejemplo" para quien mire el portfolio y quiera saltear el onboarding. | La spec pide reservar el lugar del logo; el link facilita la demo. |
| Onboarding · tu meta | Arranca con el ejemplo del Figma (bajar unos 15 kg en 8 semanas) para que se vea el chequeo de cuidado; "Usar el plazo recomendado" pasa al plazo seguro y "Ajustar mi meta" propone una meta alcanzable. "Continuar" solo aparece con una meta segura. | Mostrar el principio 1 en la primera experiencia, sin dejar avanzar con una meta insegura. |
| Onboarding · cuenta y avisos | Apple, Google y mail son solo visuales (toast "en el prototipo es simulado"). "Activar avisos" no pide permiso real al navegador. | La spec dice que la cuenta es solo visual. |
| Después del onboarding | Va a "Primer día" (personajes al 25 % y checklist que se completa de verdad: tocar la gota suma agua). El resto de la app sigue con los datos de ejemplo de Sofi para que se pueda recorrer completa. | Mostrar el estado de primer día sin dejar la demo vacía. |
| Sin conexión | Además de la pantalla, si el navegador se queda sin internet aparece un aviso amable abajo con la gota ("Podés seguir: guardamos todo y sincronizamos después"). | La spec pide el estado; así también funciona en vivo. |
| Avisos | Sumé la pantalla bloqueada con los avisos del Figma (página "Notificaciones"). Cada aviso abre la pantalla que corresponde. | Estaba en el Figma y muestra el tono sin culpa. |
| Título de la pestaña | Se arma desde `APP_NAME` en `src/main.jsx`. | Que el nombre provisorio viva en un solo lugar. |

## Resumen final

### Qué se hizo
- **Base y navegación:** barra inferior con el + que gira a ×, puntito activo que se desliza, hojas inferiores que se cierran arrastrando, toasts con personaje, transiciones de 24 px + fundido (al revés al volver), memoria de scroll, marco de teléfono de 390 × 844 en la compu y pantalla completa en el celular con zonas seguras.
- **Hoy:** aviso de cuidado colapsable, tarjetas del día con conteo animado y personajes que se llenan, agua al instante, sueño, "Por qué ajustamos" con "Mantener mi plan".
- **Entrenar:** rutina con cobertura por músculo en vivo, día de rutina, entrenamiento en curso con cronómetro y descanso reales (+15 s, saltar, vibración), molestia con alternativas reales, ¡Listo por hoy! con festejo de formas de la marca, historial, progreso de un ejercicio, biblioteca con filtro en vivo, detalle con video simulado, agregar ejercicios, armar rutina arrastrando y rutinas listas.
- **Comida:** resumen con macros, buscar con filtro en vivo y estado sin resultados, porción con macros en vivo, escanear y foto del plato simulados, detalle editable, crear alimento y "Tus números, explicados".
- **Progreso:** gráfico que se dibuja, ocultar número, medidas, fotos con siluetas, comparar con deslizador, tu mes sin rachas y revisión semanal.
- **Perfil:** modo oscuro Auto/Claro/Oscuro, objetivo con chequeo de realismo, datos del cuerpo con recálculo, molestias, recordatorios editables, Pro, privacidad con descarga de datos, pausa.
- **Onboarding y estados:** los 9 pasos, primer día, sin conexión y avisos.
- **Control de calidad:** script de Playwright que saca capturas en 360 × 740, 375 × 667, 390 × 844 y 430 × 932, en claro y oscuro, y chequea desbordes, letra menor a 11 px, áreas táctiles menores a 44 px, contenido tapado por la barra y viudas en títulos. Última pasada: 336 capturas sin problemas (quedan como falsos positivos los campos de medidas, cuya área táctil es la fila entera).

### Ajustes que hice al revisar las capturas
- Título del aviso de Hoy que salía chico; "h" sola en "meta 7 a 9 h"; links del aviso que se separaban mucho en 360 px.
- Botones de las tarjetas de Hoy que pisaban al personaje en 360 y 375 px (ahora bajan al pie).
- "Piernas y glúteos" con "glúteos" solo en un renglón (títulos balanceados).
- Explorar en Entrenar con el texto pegado al título; chips de alternativas subrayados.
- Al terminar un entrenamiento, la pantalla saliente redirigía a Entrenar en vez de a ¡Listo por hoy! (bug corregido).
- Molestia en la sentadilla búlgara decía "ya cuida esa zona" (no era cierto): ahora busca alternativas por músculos secundarios.
- Doble × en los buscadores; selector de comida en Porción que ocupaba dos renglones.
- Etiquetas de fotos ilegibles en modo oscuro; personajes cortados en la Revisión semanal.
- Meta de peso que se partía en dos renglones en 360 px (ahora son filas a lo ancho).
- Chips numéricos de 39 px de ancho (ahora 44 px mínimo).

### Pendiente
- **Nombre y logo definitivos:** cambiar `APP_NAME` en `src/brand.js` y el logo de la bienvenida (hoy, la gota).
- **Imágenes faltantes:** fotos de 14 ejercicios nuevos y portadas propias de rutinas listas (hoy usan el placeholder con la pesa rusa o fotos existentes). Lista en la página Imágenes de Figma.
- **Precio de Pro:** sigue el placeholder "$ X.XXX por mes".
- **Funciones simuladas:** video de técnica, escáner, foto del plato, cuenta, avisos y "Sacar foto de hoy".
- **Revisar con la diseñadora:** el uso de `--warn-soft` (crema) en avisos de seguridad y la decisión de usar la fecha real en vez del 20 de octubre.
- **Peso del bundle:** 575 kB (175 kB comprimido). Para un prototipo está bien; si crece, conviene dividirlo por área.
