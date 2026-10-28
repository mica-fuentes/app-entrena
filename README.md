# App de entrenamiento + alimentación · prototipo

Prototipo programado de una app que te ayuda a llegar a tu objetivo de entrenamiento y alimentación, y te cuida en el camino. Proyecto de portfolio de UX/UI.

- Diseño en Figma: https://www.figma.com/design/aSU909Jx8DJOAwTcRWPYJx
- Especificación: [`docs/SPEC.md`](docs/SPEC.md)
- Decisiones tomadas al programar: [`docs/DECISIONES.md`](docs/DECISIONES.md)

## Qué tiene
Hoy, Entrenar (con entrenamiento en curso real), Comida, Progreso, Perfil, onboarding de 9 pasos y estados (primer día, sin conexión, avisos). Modo claro y oscuro, mucha animación con `framer-motion` y respeto por `prefers-reduced-motion`. Todo lo que cargás se guarda en el navegador (`localStorage`).

En **Perfil → Prototipo** podés ver el primer día, el estado sin conexión, los avisos y volver a empezar el onboarding.

## Correrlo
```bash
npm install
npm run dev
```

## Publicarlo
Cada push a `main` lo publica en GitHub Pages (Settings → Pages → Source: GitHub Actions).

Hecho con Vite, React 19, framer-motion y react-router (HashRouter).
