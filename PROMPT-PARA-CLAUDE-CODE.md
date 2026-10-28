Vamos a programar el prototipo COMPLETO de mi app de entrenamiento + alimentación para mi portfolio de UX/UI. No hay ingenieros: lo hacés vos. Tiene que quedar como una app terminada, linda, con mucha animación e interactividad, y publicada en GitHub Pages.

MODO DE TRABAJO (importante):
- Trabajá de corrido y de forma autónoma hasta terminar TODAS las etapas. No pares entre etapas ni me pidas confirmación para seguir.
- No me hagas preguntas. Si algo no está en la spec, decidí vos con criterio (siguiendo los principios y el estilo de la spec y del Figma), anotá la decisión en `docs/DECISIONES.md` y seguí.
- Solo frená si algo te bloquea de verdad y no hay forma de avanzar (por ejemplo, para crear el repositorio en GitHub necesitás que inicie sesión). En ese caso, dejá todo lo demás terminado primero.
- Hacé commits chicos al terminar cada etapa, con mensajes claros en español.

PASOS:
1. Leé `CLAUDE.md` y `docs/SPEC.md` completos. Ahí está todo: principios, sistema visual, navegación, cada pantalla, animaciones e imágenes.
2. Si tenés el conector de Figma, usá el archivo (link en la spec) como referencia de cada pantalla (no para copiar al píxel: ver punto 5). Si no, la spec alcanza.
3. La base ya está hecha (tokens claro/oscuro, personajes animados, íconos, datos y estado). Reutilizala. El nombre de la app sale de `src/brand.js`; usalo siempre desde ahí (todavía es provisorio).
4. Construí en este orden, sin parar entre etapas:
   a. Componentes compartidos (barra de navegación con el + central, hojas inferiores, toasts, botones, chips, interruptores, stepper, barras, números animados) y transiciones entre pantallas.
   b. Hoy + registro rápido + agua + sueño + "Por qué ajustamos".
   c. Entrenar completo, incluido el entrenamiento en curso con series y descanso reales y "¡Listo por hoy!".
   d. Comida completo (buscar con filtro en vivo, porción con macros en vivo, escanear y foto del plato simulados).
   e. Progreso (gráfico que se dibuja, ocultar número, comparar fotos con deslizador, tu mes, revisión semanal).
   f. Perfil (modo oscuro, recordatorios editables, objetivo con chequeo de realismo, Pro, privacidad, pausa).
   g. Onboarding completo y estados (primer día, sin conexión).
5. El Figma es la referencia de diseño, no un plano para copiar al píxel. Programá todo para que se adapte a cualquier teléfono (de 360 a 430 px de ancho). Si al pasar algo del Figma queda sobredimensionado, mal proporcionado o con scroll incómodo, ajustalo vos con criterio de diseño (ver §8 de la spec). Nunca achiques la letra para que algo entre: reorganizá.
6. Al final de cada etapa, revisá tu propio trabajo: capturas de cada pantalla en 360×740, 375×667, 390×844 y 430×932, en claro y oscuro (Playwright o el navegador que tengas). Buscá textos cortados, desbordes, cosas tapadas por la barra, scroll doble, tamaños desproporcionados y contrastes flojos. Si tenés skills de diseño o UI, usalas para revisar. Corregí todo antes de pasar a la etapa siguiente y anotá los ajustes en `docs/DECISIONES.md`.
7. Al terminar todo: `npm run build` sin errores, revisá que la navegación completa funcione de punta a punta y dejá en `docs/DECISIONES.md` un resumen de lo que hiciste, lo que decidiste solo y lo que quedó pendiente.
8. Subí el código a un repositorio nuevo en mi GitHub y activá GitHub Pages con el workflow que ya está en `.github/workflows/deploy.yml`. Pasame el link.
