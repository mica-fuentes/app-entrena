# Contexto para Claude Code

Proyecto de portfolio de Mica (diseñadora UX/UI, Buenos Aires): prototipo programado de una app de entrenamiento + alimentación. No hay ingenieros: lo programamos nosotras, y tiene que quedar visualmente impecable, animado y navegable para mostrar en el portfolio y en GitHub.

- La especificación completa está en `docs/SPEC.md`. Leela antes de tocar nada.
- Diseño de referencia en Figma: https://www.figma.com/design/aSU909Jx8DJOAwTcRWPYJx (referencia de diseño; si el conector de Figma está disponible, usalo para ver cada pantalla).
- Ya hay base hecha: tokens claro/oscuro (`src/styles.css`), personajes animados (`src/components/Character.jsx`), íconos (`src/components/Icons.jsx`), datos de ejemplo (`src/data.js`) y estado con localStorage (`src/store.jsx`). Reutilizalos; no los reemplaces por otros.

## Reglas
- Textos en español rioplatense con voseo. Sin género cuando se puede evitar.
- No inventes un nombre nuevo para la app ni cambies colores, tipografías o el estilo de los personajes: eso ya está definido en la spec y en Figma.
- Nada de amarillo/naranja de fondo, emojis, rachas, rankings ni mensajes de culpa.
- Los principios de cuidado de `docs/SPEC.md` §1 son obligatorios (ej. nunca aceptar una meta de peso insegura).
- Mucha animación con propósito (framer-motion), siempre respetando `prefers-reduced-motion`.
- Trabajá de forma autónoma: no frenes a preguntar. Si algo no está en la spec, decidí con criterio, anotalo en `docs/DECISIONES.md` y seguí. Solo frená ante un bloqueo real (por ejemplo, un login).
- El nombre de la app es provisorio y vive en `src/brand.js`: nunca lo escribas a mano en otro lado.
- El Figma es referencia, no plano al píxel: la app tiene que adaptarse a cualquier teléfono (360 a 430 px de ancho) y vos ajustás medidas, scrolls y proporciones con criterio de diseño cuando lo copiado no funciona en pantalla real (ver `docs/SPEC.md` §8). Nunca achicar la letra para que algo entre.
- Revisá tu propio trabajo con capturas en 4 tamaños (claro y oscuro) y corregí errores de diseño vos solo antes de seguir.

## Comandos
- `npm install` · `npm run dev` (desarrollo) · `npm run build` · `npm run preview`
