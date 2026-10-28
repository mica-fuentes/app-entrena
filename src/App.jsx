import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { StoreProvider, useStore } from './store'
import { OverlayCtx, PageCtx, visits } from './components/ui'
import { Nav, OfflineBanner, StatusBar, TABS, Toast } from './components/Shell'
import { GlobalSheets } from './screens/hoy/Sheets'
import Hoy from './screens/hoy/Hoy'
import PorQue from './screens/hoy/PorQue'
import Sueno from './screens/hoy/Sueno'
import * as Entrenar from './screens/entrenar'
import * as Comida from './screens/comida'
import * as Progreso from './screens/progreso'
import * as Perfil from './screens/perfil'
import Onboarding from './screens/onboarding/Onboarding'
import { PrimerDia, SinConexion, Avisos } from './screens/estados'

// Pantallas en modo foco o modal: sin barra de navegación (SPEC §3)
const NO_NAV = ['/onboarding', '/sueno', '/entrenar/en-curso', '/entrenar/listo', '/comida/buscar', '/comida/porcion', '/comida/escanear', '/comida/foto', '/comida/crear', '/progreso/peso', '/sin-conexion', '/avisos']
// Pantallas con encabezado de color: la barra de estado va adentro y scrollea con él
const CLEAR = ['/entrenar/listo', '/perfil/pro', '/progreso/revision', '/comida/escanear', '/avisos']
const ROOTS = TABS.map((t) => t.to)

const tabOf = (p) => (p.startsWith('/entrenar') ? 'entrenar' : p.startsWith('/comida') ? 'comida' : p.startsWith('/progreso') ? 'progreso' : 'hoy')
const tabIdx = (p) => TABS.findIndex((t) => t.id === tabOf(p))

function Shell() {
  const location = useLocation()
  const type = useNavigationType()
  const { onboarded, sheet } = useStore()
  const [overlay, setOverlay] = useState(null)
  const path = location.pathname
  const nav = !NO_NAV.some((p) => path.startsWith(p))
  const clear = CLEAR.some((p) => path.startsWith(p))

  // Ir hacia adelante desliza a la izquierda; volver, al revés. Entre pestañas, según su orden.
  const last = useRef(path)
  const page = useMemo(() => {
    const from = last.current
    last.current = path
    const idx = window.history.state?.idx ?? 0
    // guardamos qué pantalla hay en cada posición del historial
    const i = visits.findIndex((v) => v.idx === idx)
    if (i >= 0) visits.splice(i)
    visits.push({ path, idx })
    let dir = type === 'POP' ? -1 : 1
    if (ROOTS.includes(from) && ROOTS.includes(path) && from !== path) dir = tabIdx(path) > tabIdx(from) ? 1 : -1
    return { dir, type }
  }, [location.key]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="device">
      <OverlayCtx.Provider value={overlay}>
        <PageCtx.Provider value={page}>
          <AnimatePresence custom={page.dir} initial={false}>
            <Routes location={location} key={path}>
              <Route path="/" element={<Navigate to={onboarded ? '/hoy' : '/onboarding'} replace />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/hoy" element={<Hoy />} />
              <Route path="/por-que" element={<PorQue />} />
              <Route path="/sueno" element={<Sueno />} />
              <Route path="/primer-dia" element={<PrimerDia />} />
              <Route path="/sin-conexion" element={<SinConexion />} />
              <Route path="/avisos" element={<Avisos />} />

              <Route path="/entrenar" element={<Entrenar.Inicio />} />
              <Route path="/entrenar/rutina" element={<Entrenar.Cobertura />} />
              <Route path="/entrenar/dia/:n" element={<Entrenar.Dia />} />
              <Route path="/entrenar/en-curso" element={<Entrenar.Entrenando />} />
              <Route path="/entrenar/listo" element={<Entrenar.Terminado />} />
              <Route path="/entrenar/historial" element={<Entrenar.Historial />} />
              <Route path="/entrenar/progreso/:id" element={<Entrenar.ProgresoEjercicio />} />
              <Route path="/entrenar/ejercicios" element={<Entrenar.Biblioteca />} />
              <Route path="/entrenar/ejercicio/:id" element={<Entrenar.Detalle />} />
              <Route path="/entrenar/agregar" element={<Entrenar.Agregar />} />
              <Route path="/entrenar/armar" element={<Entrenar.Armar />} />
              <Route path="/entrenar/listas" element={<Entrenar.Listas />} />

              <Route path="/comida" element={<Comida.Inicio />} />
              <Route path="/comida/buscar" element={<Comida.Buscar />} />
              <Route path="/comida/porcion/:id" element={<Comida.Porcion />} />
              <Route path="/comida/escanear" element={<Comida.Escanear />} />
              <Route path="/comida/foto" element={<Comida.FotoPlato />} />
              <Route path="/comida/detalle/:id" element={<Comida.Detalle />} />
              <Route path="/comida/crear" element={<Comida.Crear />} />
              <Route path="/comida/numeros" element={<Comida.Numeros />} />

              <Route path="/progreso" element={<Progreso.Inicio />} />
              <Route path="/progreso/peso" element={<Progreso.Peso />} />
              <Route path="/progreso/medidas" element={<Progreso.Medidas />} />
              <Route path="/progreso/fotos" element={<Progreso.Fotos />} />
              <Route path="/progreso/comparar" element={<Progreso.Comparar />} />
              <Route path="/progreso/mes" element={<Progreso.Mes />} />
              <Route path="/progreso/revision" element={<Progreso.Revision />} />

              <Route path="/perfil" element={<Perfil.Inicio />} />
              <Route path="/perfil/objetivo" element={<Perfil.Objetivo />} />
              <Route path="/perfil/cuerpo" element={<Perfil.Cuerpo />} />
              <Route path="/perfil/lesiones" element={<Perfil.Lesiones />} />
              <Route path="/perfil/dias" element={<Perfil.Dias />} />
              <Route path="/perfil/recordatorios" element={<Perfil.Recordatorios />} />
              <Route path="/perfil/pro" element={<Perfil.Pro />} />
              <Route path="/perfil/privacidad" element={<Perfil.Privacidad />} />
              <Route path="/perfil/pausa" element={<Perfil.Pausa />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          {!clear && <StatusBar />}
          <Nav tab={tabOf(path)} visible={nav} />
          <OfflineBanner hidden={!nav || sheet} />
          <GlobalSheets />
          <Toast />
          <div ref={setOverlay} />
          <div className="home-ind" />
        </PageCtx.Provider>
      </OverlayCtx.Provider>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <MotionConfig reducedMotion="user">
          <Shell />
        </MotionConfig>
      </HashRouter>
    </StoreProvider>
  )
}
