import { useEffect, useId, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

/*
  Personajes: cada forma es un dato del día.
  gota = agua · manzana = comida · luna = descanso · pesa rusa = entreno
  Se llenan según `level` (0-100) y su cara muestra cómo está el cuerpo, nunca un juicio.
*/
const INK = '#16171D'
const SHAPES = {
  entreno: { vb: '-4 -4 108 132', w: 100, h: 124, fill: '#5A7DFF', soft: '#DCE4FF', cx: 50, ey: 70, fillY: 24, fillH: 100 },
  comida: { vb: '-4 -4 112 126', w: 104, h: 118, fill: '#FF6FAE', soft: '#FFE1EE', cx: 52, ey: 60, fillY: 0, fillH: 118 },
  agua: { vb: '-4 -4 104 124', w: 96, h: 116, fill: '#22BFE0', soft: '#D4F3FA', cx: 48, ey: 70, fillY: 0, fillH: 116 },
  descanso: { vb: '-4 -14 124 130', w: 116, h: 116, fill: '#B8E62E', soft: '#EEF8CC', cx: 40, ey: 62, fillY: 4, fillH: 112 },
}
const APPLE = 'M 52 30 C 68 16 104 20 104 60 C 104 94 80 118 52 112 C 24 118 0 94 0 60 C 0 20 36 16 52 30 Z'
const DROP = 'M 48 2 C 56 2 96 50 96 76 C 96 100 75 116 48 116 C 21 116 0 100 0 76 C 0 50 40 2 48 2 Z'

function Face({ cx, ey, expr }) {
  const st = { fill: 'none', stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' }
  const L = cx - 13, R = cx + 13
  if (expr === 'dormido') {
    return (
      <g>
        <path d={`M ${L - 6} ${ey} Q ${L} ${ey + 6} ${L + 6} ${ey} M ${R - 6} ${ey} Q ${R} ${ey + 6} ${R + 6} ${ey}`} {...st} />
        <ellipse cx={cx} cy={ey + 17} rx="3.5" ry="4" fill={INK} />
      </g>
    )
  }
  if (expr === 'cansado') {
    return (
      <g>
        <path d={`M ${L - 6} ${ey} L ${L + 6} ${ey} M ${R - 6} ${ey} L ${R + 6} ${ey}`} {...st} />
        <ellipse cx={cx} cy={ey + 15} rx="3.5" ry="4.2" fill={INK} />
        <path className="sweat" d={`M ${cx + 30} ${ey - 26} C ${cx + 31} ${ey - 26} ${cx + 35} ${ey - 20} ${cx + 35} ${ey - 17} C ${cx + 35} ${ey - 14} ${cx + 33} ${ey - 12} ${cx + 30} ${ey - 12} C ${cx + 27} ${ey - 12} ${cx + 25} ${ey - 14} ${cx + 25} ${ey - 17} C ${cx + 25} ${ey - 20} ${cx + 29} ${ey - 26} ${cx + 30} ${ey - 26} Z`} fill="#BDEFFA" stroke={INK} strokeWidth="1.5" />
      </g>
    )
  }
  if (expr === 'satisfecho') {
    return (
      <g>
        <path d={`M ${L - 6} ${ey + 2} Q ${L} ${ey - 5} ${L + 6} ${ey + 2} M ${R - 6} ${ey + 2} Q ${R} ${ey - 5} ${R + 6} ${ey + 2}`} {...st} />
        <path d={`M ${cx - 8} ${ey + 14} Q ${cx} ${ey + 21} ${cx + 8} ${ey + 14}`} {...st} />
      </g>
    )
  }
  const big = expr === 'energia'
  return (
    <g>
      <g className="blink">
        <ellipse cx={L} cy={ey} rx={big ? 5.2 : 4.5} ry={big ? 7 : 6} fill={INK} />
        <ellipse cx={R} cy={ey} rx={big ? 5.2 : 4.5} ry={big ? 7 : 6} fill={INK} />
      </g>
      {big
        ? <path d={`M ${cx - 10} ${ey + 12} L ${cx + 10} ${ey + 12} A 10 10 0 0 1 ${cx - 10} ${ey + 12} Z`} fill={INK} />
        : <path d={`M ${cx - 8} ${ey + 14} Q ${cx} ${ey + 21} ${cx + 8} ${ey + 14}`} {...st} />}
    </g>
  )
}

export default function Character({ forma = 'agua', expr = 'contento', level = 60, size = 80, breathe = true, label }) {
  const s = SHAPES[forma]
  const id = useId().replace(/:/g, '')
  const controls = useAnimationControls()
  const first = useRef(true)
  const lv = Math.max(0, Math.min(100, level))
  const off = s.fillH * (1 - lv / 100)

  // salto con rebote cuando cambia el nivel
  useEffect(() => {
    if (first.current) { first.current = false; return }
    controls.start({ scaleX: [1, 1.12, 0.95, 1], scaleY: [1, 0.9, 1.06, 1], transition: { duration: 0.55, ease: 'easeOut' } })
  }, [lv, controls])

  const [vx, vy, vw, vh] = s.vb.split(' ').map(Number)
  const height = (size * vh) / vw

  const fillGroup = (
    <>
      <rect x="-4" y={s.fillY - 2} width={s.w + 8} height={s.fillH + 4} fill={s.soft} />
      <motion.rect
        x="-4" width={s.w + 8} height={s.fillH + 4} fill={s.fill}
        initial={{ y: s.fillY + s.fillH }}
        animate={{ y: s.fillY + off }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      />
    </>
  )

  return (
    <motion.svg
      animate={controls}
      style={{ transformOrigin: '50% 100%', display: 'block', overflow: 'visible' }}
      width={size} height={height} viewBox={`${vx} ${vy} ${vw} ${vh}`}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
    >
      <g className={breathe ? 'breathe' : undefined}>
        {forma === 'entreno' && (
          <>
            <defs><clipPath id={`c${id}`}><circle cx="50" cy="74" r="50" /></clipPath></defs>
            <path fillRule="evenodd" fill={s.soft} stroke={INK} strokeWidth="3" d="M44 0 H56 A26 26 0 0 1 82 26 V28 A26 26 0 0 1 56 54 H44 A26 26 0 0 1 18 28 V26 A26 26 0 0 1 44 0 Z M47 11 H53 A14 14 0 0 1 67 25 V27 A14 14 0 0 1 53 41 H47 A14 14 0 0 1 33 27 V25 A14 14 0 0 1 47 11 Z" />
            <g clipPath={`url(#c${id})`}>{fillGroup}</g>
            <circle cx="50" cy="74" r="50" fill="none" stroke={INK} strokeWidth="3" />
          </>
        )}
        {forma === 'comida' && (
          <>
            <defs><clipPath id={`c${id}`}><path d={APPLE} /></clipPath></defs>
            <rect x="49" y="8" width="5" height="16" rx="2.5" fill={INK} transform="rotate(-10 51 16)" />
            <g clipPath={`url(#c${id})`}>{fillGroup}</g>
            <path d={APPLE} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          </>
        )}
        {forma === 'agua' && (
          <>
            <defs><clipPath id={`c${id}`}><path d={DROP} /></clipPath></defs>
            <g clipPath={`url(#c${id})`}>{fillGroup}</g>
            <path d={DROP} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          </>
        )}
        {forma === 'descanso' && (
          <>
            <defs>
              <clipPath id={`c${id}`}><circle cx="54" cy="58" r="54" /></clipPath>
              <mask id={`m${id}`}>
                <rect x="-10" y="-20" width="140" height="140" fill="#fff" />
                <circle cx="93" cy="17" r="39" fill="#000" />
              </mask>
            </defs>
            <g mask={`url(#m${id})`}>
              <g clipPath={`url(#c${id})`}>{fillGroup}</g>
              <circle cx="54" cy="58" r="54" fill="none" stroke={INK} strokeWidth="3" />
            </g>
            <circle cx="93" cy="17" r="39" fill="none" stroke={INK} strokeWidth="3" clipPath={`url(#c${id})`} />
            {expr === 'dormido' && (
              <g fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700" fill="currentColor" style={{ color: 'var(--ink)' }}>
                <text className="zz" x="84" y="20" fontSize="16">z</text>
                <text className="zz late" x="98" y="4" fontSize="22">z</text>
              </g>
            )}
          </>
        )}
        <Face cx={s.cx} ey={s.ey} expr={expr} />
      </g>
    </motion.svg>
  )
}
