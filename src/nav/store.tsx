import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { App as CapApp } from '@capacitor/app';
import type { AppState, ScreenId, TabId } from '../types';
import { esNativo, setHaptica } from '../platform/native';

export const TABS: TabId[] = ['home', 'citas', 'docs', 'perfil'];

/** Parámetros de URL para QA y presentación: ?demo=rapido (loaders de un ciclo), ?dias=3..7, ?previos=15 */
function presenterDesdeUrl(): AppState['presenter'] {
  const p = { forzarDias: null as number | null, unCiclo: false, diasPrevios: 0 };
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('demo') === 'rapido') p.unCiclo = true;
    const d = Number(q.get('dias')); if (d >= 3 && d <= 7) p.forzarDias = d;
    if (q.get('previos') === '15') p.diasPrevios = 15;
  } catch { /* sin window */ }
  return p;
}

export function estadoInicial(): AppState {
  return {
    logged: false, watch: false, alertNever: false, alertSeen: false, haptica: true,
    toggles: { hours: true, geo: true }, tab: 'home',
    psico: null, psicoSlot: null, sesiones: [],
    medId: 'eq', medSlot: 0, medOthers: false, citaConfirmada: false, preConsulta: null,
    horaLlego: false, consultaHecha: false, evaluacion: null, certEmitido: false, tramiteListo: false,
    correoDest: 'jefe', jefeNombre: '', correoJefe: 'jefe@tuempresa.com', correoRrhh: 'rrhh@tuempresa.com',
    presenter: presenterDesdeUrl(),
  };
}

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

interface Ctx {
  state: AppState;
  set: (p: Patch) => void;
  reset: () => void;
  // navegación
  stack: ScreenId[];
  current: ScreenId;
  dir: 1 | -1;
  go: (id: ScreenId) => void;
  replace: (id: ScreenId) => void;
  back: () => void;
  goTab: (tab: TabId) => void;
  goHome: () => void;
  // capas
  sheetOpen: boolean; setSheetOpen: (v: boolean) => void;
  viewerDoc: 'cert' | 'aviso' | null; setViewerDoc: (v: 'cert' | 'aviso' | null) => void;
  presenterOpen: boolean; setPresenterOpen: (v: boolean) => void;
  toast: (msg: string) => void; toastMsg: string | null;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(estadoInicial);
  const [stack, setStack] = useState<ScreenId[]>(['login']);
  const [dir, setDir] = useState<1 | -1>(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<'cert' | 'aviso' | null>(null);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const set = useCallback((p: Patch) => setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })), []);
  useEffect(() => { setHaptica(state.haptica); }, [state.haptica]);

  // Historial del navegador: cada avance empuja un estado; popstate = atrás.
  const stackRef = useRef(stack); stackRef.current = stack;
  const ignorePop = useRef(false);

  const go = useCallback((id: ScreenId) => {
    setDir(1);
    setStack((s) => (s[s.length - 1] === id ? s : [...s, id]));
    try { history.pushState({ d: stackRef.current.length + 1 }, ''); } catch { /* file:// */ }
  }, []);
  const replace = useCallback((id: ScreenId) => { setDir(1); setStack((s) => [...s.slice(0, -1), id]); }, []);
  const popInterno = useCallback(() => {
    setDir(-1);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const back = useCallback(() => {
    if (stackRef.current.length <= 1) return;
    ignorePop.current = true;
    try { history.back(); } catch { popInterno(); }
    // Si el historial no responde (p. ej. file://), hacemos el pop nosotros.
    window.setTimeout(() => { if (ignorePop.current) { ignorePop.current = false; popInterno(); } }, 120);
  }, [popInterno]);
  const goTab = useCallback((tab: TabId) => {
    setDir(1);
    set({ tab });
    setStack([tab]);
    try { history.pushState({ d: 1 }, ''); } catch { /* */ }
  }, [set]);
  const goHome = useCallback(() => { setDir(-1); set({ tab: 'home' }); setStack(['home']); try { history.pushState({ d: 1 }, ''); } catch { /* */ } }, [set]);

  useEffect(() => {
    const onPop = () => {
      if (ignorePop.current) { ignorePop.current = false; popInterno(); return; }
      if (stackRef.current.length > 1) popInterno();
      else { try { history.pushState({ d: 1 }, ''); } catch { /* */ } }
    };
    window.addEventListener('popstate', onPop);
    try { history.replaceState({ d: 1 }, ''); } catch { /* */ }
    return () => window.removeEventListener('popstate', onPop);
  }, [popInterno]);

  // Botón atrás de Android: capas → pila propia → minimizar en la raíz.
  const layersRef = useRef({ sheetOpen, viewerDoc, presenterOpen });
  layersRef.current = { sheetOpen, viewerDoc, presenterOpen };
  useEffect(() => {
    if (!esNativo()) return;
    const sub = CapApp.addListener('backButton', () => {
      const L = layersRef.current;
      if (L.presenterOpen) { setPresenterOpen(false); return; }
      if (L.viewerDoc) { setViewerDoc(null); return; }
      if (L.sheetOpen) { setSheetOpen(false); return; }
      if (stackRef.current.length > 1) { popInterno(); return; }
      if (stackRef.current[0] !== 'home' && stackRef.current[0] !== 'login') { setDir(-1); setStack(['home']); return; }
      void CapApp.minimizeApp();
    });
    return () => { void sub.then((h) => h.remove()); };
  }, [popInterno]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const reset = useCallback(() => {
    setState(estadoInicial());
    setSheetOpen(false); setViewerDoc(null); setPresenterOpen(false);
    setDir(-1); setStack(['login']);
  }, []);

  const value = useMemo<Ctx>(() => ({
    state, set, reset, stack, current: stack[stack.length - 1], dir, go, replace, back, goTab, goHome,
    sheetOpen, setSheetOpen, viewerDoc, setViewerDoc, presenterOpen, setPresenterOpen, toast, toastMsg,
  }), [state, set, reset, stack, dir, go, replace, back, goTab, goHome, sheetOpen, viewerDoc, presenterOpen, toast, toastMsg]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp fuera de AppProvider');
  return c;
}

/** Temporizadores que se limpian solos al salir de la pantalla. */
export function useTimers() {
  const ids = useRef<number[]>([]);
  useEffect(() => () => { ids.current.forEach((t) => window.clearTimeout(t)); ids.current = []; }, []);
  return useCallback((fn: () => void, ms: number) => { const t = window.setTimeout(fn, ms); ids.current.push(t); return t; }, []);
}
