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
