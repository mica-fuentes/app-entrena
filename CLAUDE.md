# Contexto para Claude Code

Proyecto de portfolio de Mica (diseñadora UX/UI, Buenos Aires): prototipo programado de una app de entrenamiento + alimentación. No hay ingenieros: lo programamos nosotras, y tiene que quedar visualmente impecable, animado y navegable para mostrar en el portfolio y en GitHub.

- La especificación completa está en `docs/SPEC.md`. Leela antes de tocar nada.
- Diseño de referencia en Figma: https://www.figma.com/design/aSU909Jx8DJOAwTcRWPYJx (si el conector de Figma está disponible, usalo para ver cada pantalla).
- Ya hay base hecha: tokens claro/oscuro (`src/styles.css`), personajes animados (`src/components/Character.jsx`), íconos (`src/components/Icons.jsx`), datos de ejemplo (`src/data.js`) y estado con localStorage (`src/store.jsx`). Reutilizalos; no los reemplaces por otros.

## Reglas
- Textos en español rioplatense con voseo. Sin género cuando se puede evitar.
- No inventes el nombre de la app (no está decidido) ni cambies colores, tipografías o el estilo de los personajes sin preguntar.
- Nada de amarillo/naranja de fondo, emojis, rachas, rankings ni mensajes de culpa.
- Los principios de cuidado de `docs/SPEC.md` §1 son obligatorios (ej. nunca aceptar una meta de peso insegura).
- Mucha animación con propósito (framer-motion), siempre respetando `prefers-reduced-motion`.
- Antes de decidir algo de contenido que no esté en la spec (nombres, textos nuevos importantes, qué incluye una pantalla), preguntale a Mica.
- Probá cada pantalla en 390×844 en claro y en oscuro antes de darla por terminada.

## Comandos
- `npm install` · `npm run dev` (desarrollo) · `npm run build` · `npm run preview`
