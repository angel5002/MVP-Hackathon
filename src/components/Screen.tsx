import { useRef, type ReactNode } from 'react';
import { useApp } from '../nav/store';
import { Icon, type IconName } from './icons';
import { PERSONA } from '../data/red';
import { haptic } from '../platform/native';
import type { TabId } from '../types';

const TAB_META: Record<TabId, { label: string; icon: IconName }> = {
  home: { label: 'Hoy', icon: 'home' }, citas: { label: 'Citas', icon: 'calendar' }, docs: { label: 'Documentos', icon: 'doc' }, perfil: { label: 'Perfil', icon: 'user' },
};

/** Marca PAUSA: triple toque = reiniciar prototipo; mantener 2 s = modo presentador. */
export function Brand({ texto, greeting = false }: { texto?: string; greeting?: boolean }) {
  const { reset, setPresenterOpen } = useApp();
  const taps = useRef(0); const tapTimer = useRef<number>(0); const holdTimer = useRef<number>(0);
  const down = () => {
    taps.current += 1; window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => { taps.current = 0; }, 700);
    if (taps.current >= 3) { taps.current = 0; reset(); return; }
    holdTimer.current = window.setTimeout(() => { void haptic('medium'); setPresenterOpen(true); }, 2000);
  };
  const up = () => window.clearTimeout(holdTimer.current);
  return <span className={`topbar__brand ${greeting ? 'topbar__brand--greeting' : ''}`} onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={(e) => e.preventDefault()}>{texto ?? 'PAUSA'}</span>;
}

export function TopBar({ back, right = 'avatar', titulo, greeting, leftChip }: { back?: boolean; right?: 'avatar' | 'none'; titulo?: string; greeting?: boolean; leftChip?: ReactNode }) {
  const { back: goBack, goTab } = useApp();
  return (
    <header className="topbar">
      <div className="topbar__side" style={leftChip ? { width: 'auto' } : undefined}>
        {back ? <button className="iconbtn iconbtn--round" aria-label="Atrás" onClick={goBack}><Icon name="back" /></button>
          : leftChip ?? <Icon name="logo" size={26} color="var(--c-acento)" />}
      </div>
      <Brand texto={titulo} greeting={greeting} />
      <div className="topbar__side">
        {right === 'avatar' && <button className="avatar av-blue" aria-label="Perfil" onClick={() => goTab('perfil')}>{PERSONA.iniciales}</button>}
      </div>
    </header>
  );
}

const ORDEN: (TabId | 'fab')[] = ['home', 'citas', 'fab', 'docs', 'perfil'];

export function TabBar() {
  const { state, goTab, go } = useApp();
  return (
    <nav className="tabbar" aria-label="Secciones">
      {ORDEN.map((t) => {
        if (t === 'fab') return <button key="fab" className="fab" aria-label="Pedir ayuda" onClick={() => { void haptic('medium'); go('ayuda'); }}><Icon name="plus" stroke={2.2} /></button>;
        const active = state.tab === t;
        return (
          <button key={t} className={`tab ${active ? 'tab--active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => { if (!active) { void haptic('light'); goTab(t); } }}>
            <Icon name={TAB_META[t].icon} stroke={active ? 2 : 1.6} />
            {TAB_META[t].label}
            {t === 'docs' && state.tramiteListo && <span className="tab__dot" aria-label="Documentos nuevos" />}
          </button>
        );
      })}
    </nav>
  );
}

export function Screen({ children, back, tabs, cta, center, fill, bar = true, right, className = '', titulo, greeting, leftChip }:
  { children: ReactNode; back?: boolean; tabs?: boolean; cta?: ReactNode; center?: boolean; fill?: boolean; bar?: boolean; right?: 'avatar' | 'none'; className?: string; titulo?: string; greeting?: boolean; leftChip?: ReactNode }) {
  return (
    <div className={`screen ${center ? 'screen--center' : ''} ${fill ? 'screen--fill' : ''} ${className}`}>
      {bar && <TopBar back={back} right={right} titulo={titulo} greeting={greeting} leftChip={leftChip} />}
      <div className={`screen__scroll ${cta ? 'screen__scroll--cta' : ''} ${tabs ? 'screen__scroll--tabs' : ''}`}>{children}</div>
      {cta && <div className={`cta ${tabs ? 'cta--tabs' : ''}`}>{cta}</div>}
    </div>
  );
}
