import { useEffect, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppProvider, useApp } from './nav/store';
import type { ScreenId } from './types';
import { esNativo, modoPresentacion } from './platform/native';
import { Viewer } from './components/Viewer';
import { PresenterPanel } from './components/PresenterPanel';
import { Login, Watch } from './screens/Auth';
import { Home } from './screens/Home';
import { Citas, Docs, Perfil } from './screens/Tabs';
import { Ayuda, Psico, PsicoOk } from './screens/Ayuda';
import { Buscando, Cita, Medico, Pre, PreIntro, PreResultado } from './screens/Medico';
import { Cert, Emitiendo, Evaluacion, Sala, Tele } from './screens/Consulta';
import { Correo, Empleador, Proceso, Tramite } from './screens/Tramite';

const SCREENS: Record<ScreenId, ComponentType> = {
  login: Login, watch: Watch, home: Home, citas: Citas, docs: Docs, perfil: Perfil,
  ayuda: Ayuda, psico: Psico, psicoOk: PsicoOk,
  buscando: Buscando, medico: Medico, preIntro: PreIntro, pre: Pre, preResultado: PreResultado,
  cita: Cita, sala: Sala, tele: Tele, evaluacion: Evaluacion, emitiendo: Emitiendo, cert: Cert, tramite: Tramite, proceso: Proceso,
  empleador: Empleador, correo: Correo,
};

/** Transición de eje compartido (X): adelante entra desde la derecha, atrás desde la izquierda. */
function Router() {
  const { current, dir } = useApp();
  const rm = useReducedMotion();
  const Comp = SCREENS[current];
  const variants = {
    enter: (d: number) => (rm ? { opacity: 0 } : { x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => (rm ? { opacity: 0 } : { x: d > 0 ? -32 : 32, opacity: 0 }),
  };
  return (
    <AnimatePresence initial={false} custom={dir} mode="popLayout">
      <motion.div key={current} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }} style={{ position: 'absolute', inset: 0 }}>
        <Comp />
      </motion.div>
    </AnimatePresence>
  );
}

function Toast() {
  const { toastMsg } = useApp();
  return (
    <AnimatePresence>
      {toastMsg && <motion.div className="toast" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{toastMsg}</motion.div>}
    </AnimatePresence>
  );
}

function Shell() {
  return (
    <div className="app">
      <Router />
      <Viewer />
      <Toast />
      <PresenterPanel />
    </div>
  );
}

/** En escritorio, la app se muestra dentro de un teléfono para proyectar en el pitch. */
function Presentacion() {
  const [hora, setHora] = useState(() => new Date());
  useEffect(() => { const t = window.setInterval(() => setHora(new Date()), 30000); return () => window.clearInterval(t); }, []);
  const hh = `${hora.getHours()}:${String(hora.getMinutes()).padStart(2, '0')}`;
  return (
    <div className="stage">
      <div className="phone">
        <span className="phone__clock" aria-hidden="true">{hh}</span>
        <Shell />
      </div>
    </div>
  );
}

export default function App() {
  const [presentacion, setPresentacion] = useState(modoPresentacion);
  useEffect(() => {
    if (esNativo()) void SplashScreen.hide();
    const onResize = () => setPresentacion(modoPresentacion());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return <AppProvider>{presentacion ? <Presentacion /> : <Shell />}</AppProvider>;
}
