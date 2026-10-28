const P = {
  hoy: 'M2 9 L10 2 L18 9 L18 18 L12.5 18 L12.5 12.5 L7.5 12.5 L7.5 18 L2 18 Z',
  entrenar: 'M5 4 L5 16 M15 4 L15 16 M1.5 7 L1.5 13 M18.5 7 L18.5 13 M5 10 L15 10',
  comida: 'M5 1 L5 19 M2 1 L2 6 C2 7.7 3.3 9 5 9 C6.7 9 8 7.7 8 6 L8 1 M15 19 L15 1 C12.8 1 12 4 12 7 C12 9 13 10 15 10',
  progreso: 'M1 15 L7 9 L11 13 L19 5 M13.5 5 L19 5 L19 10.5',
  plus: 'M10 2 L10 18 M2 10 L18 10',
  minus: 'M3 10 L17 10',
  back: 'M13 3 L6 10 L13 17',
  chevron: 'M7 3 L14 10 L7 17',
  search: 'M8.5 2 C12.1 2 15 4.9 15 8.5 C15 12.1 12.1 15 8.5 15 C4.9 15 2 12.1 2 8.5 C2 4.9 4.9 2 8.5 2 Z M13.2 13.2 L18 18',
  close: 'M4 4 L16 16 M16 4 L4 16',
  check: 'M3 10.5 L8 15 L17 5',
  edit: 'M3 17 L3.5 13.5 L13 4 C13.7 3.3 14.8 3.3 15.5 4 L16 4.5 C16.7 5.2 16.7 6.3 16 7 L6.5 16.5 Z M11.5 5.5 L14.5 8.5',
  play: 'M6 3 L16 10 L6 17 Z',
  camera: 'M2 6 L5 6 L7 3 L13 3 L15 6 L18 6 L18 17 L2 17 Z M10 8 C12 8 13.5 9.5 13.5 11.5 C13.5 13.5 12 15 10 15 C8 15 6.5 13.5 6.5 11.5 C6.5 9.5 8 8 10 8 Z',
  barcode: 'M2 4 L2 16 M5 4 L5 16 M8 4 L8 16 M12 4 L12 16 M14 4 L14 16 M18 4 L18 16',
  scale: 'M2 13 L2 17 L18 17 L18 13 M4 13 L6 5 L14 5 L16 13 Z M10 5 L11.5 9',
  moon: 'M15 12.5 C14 15.2 11.4 17 8.5 17 C4.9 17 2 14.1 2 10.5 C2 7.6 3.8 5 6.5 4 C6 8.5 9.5 12.5 15 12.5 Z',
  sun: 'M10 6 C12.2 6 14 7.8 14 10 C14 12.2 12.2 14 10 14 C7.8 14 6 12.2 6 10 C6 7.8 7.8 6 10 6 Z M10 1 L10 3 M10 17 L10 19 M1 10 L3 10 M17 10 L19 10 M3.6 3.6 L5 5 M15 15 L16.4 16.4 M3.6 16.4 L5 15 M15 5 L16.4 3.6',
  lock: 'M5 9 L15 9 L15 18 L5 18 Z M7 9 L7 6 C7 4.3 8.3 3 10 3 C11.7 3 13 4.3 13 6 L13 9',
  bell: 'M5 14 L5 9 C5 6.2 7.2 4 10 4 C12.8 4 15 6.2 15 9 L15 14 L17 16 L3 16 Z M8 18 L12 18',
  user: 'M10 3 C12.2 3 14 4.8 14 7 C14 9.2 12.2 11 10 11 C7.8 11 6 9.2 6 7 C6 4.8 7.8 3 10 3 Z M3 18 C3.8 14.6 6.6 13 10 13 C13.4 13 16.2 14.6 17 18',
  drag: 'M7 4 L7 4.01 M13 4 L13 4.01 M7 10 L7 10.01 M13 10 L13 10.01 M7 16 L7 16.01 M13 16 L13 16.01',
  timer: 'M10 5 C13.9 5 17 8.1 17 12 C17 15.9 13.9 19 10 19 C6.1 19 3 15.9 3 12 C3 8.1 6.1 5 10 5 Z M10 8 L10 12 L12.5 13.5 M8 1 L12 1',
}

export default function Icon({ name, size = 22, stroke = 1.8, color = 'currentColor', fill = 'none', style }) {
  const d = P[name]
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', overflow: 'visible', ...style }}>
      <path d={d} fill={name === 'play' ? color : fill} />
    </svg>
  )
}
