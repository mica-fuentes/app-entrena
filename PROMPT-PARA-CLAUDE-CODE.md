Hola. Vamos a programar el prototipo completo de mi app de entrenamiento + alimentación para mi portfolio de UX/UI. No hay ingenieros: lo hacemos vos y yo, y tiene que quedar como una app terminada, linda, con mucha animación e interactividad, y publicada en GitHub Pages.

1. Leé `CLAUDE.md` y `docs/SPEC.md` completos antes de empezar. Ahí está todo: principios, sistema visual, navegación, cada pantalla, animaciones e imágenes.
2. Si tenés el conector de Figma, mirá el archivo (link en la spec) para copiar exacto cada pantalla. Si no, la spec alcanza.
3. La base ya está hecha (tokens claro/oscuro, personajes animados, íconos, datos y estado). Reutilizala.
4. Trabajá en este orden y mostrame cada etapa corriendo (`npm run dev`) antes de seguir:
   a. Componentes compartidos (barra de navegación con el + central, hojas inferiores, toasts, botones, chips, interruptores, stepper, barras, números animados) y transiciones entre pantallas.
   b. Hoy + registro rápido + agua + sueño + "Por qué ajustamos".
   c. Entrenar completo, incluido el entrenamiento en curso con series y descanso reales, y la pantalla de "¡Listo por hoy!".
   d. Comida completo (buscar con filtro en vivo, porción con macros en vivo, escanear y foto del plato simulados).
   e. Progreso (gráfico que se dibuja, ocultar número, comparar fotos con deslizador, tu mes, revisión semanal).
   f. Perfil (modo oscuro, recordatorios editables, objetivo con chequeo de realismo, Pro, privacidad, pausa).
   g. Onboarding completo y estados (primer día, sin conexión).
5. Probá cada pantalla a 390×844 en modo claro y oscuro; revisá contrastes y que no haya textos cortados.
6. Al final: `npm run build` sin errores, creá el repositorio en mi GitHub, subí el código y activá GitHub Pages con el workflow que ya está en `.github/workflows/deploy.yml`. Pasame el link.

Si algo de contenido no está en la spec (un nombre, un texto importante, qué incluye una pantalla), preguntame antes de inventarlo.
