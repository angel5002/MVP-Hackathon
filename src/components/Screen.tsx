import { useRef, type ReactNode } from 'react';
import { TABS, useApp } from '../nav/store';
import { Icon, type IconName } from './icons';
import { PERSONA } from '../data/red';
import { haptic } from '../platform/native';
import type { TabId } from '../types';

const TAB_META: Record<TabId, { label: string; icon: IconName }> = {
  home: { label: 'Inicio', icon: 'home' }, citas: { label: 'Citas', icon: 'calendar' }, docs: { label: 'Documentos', icon: 'doc' }, perfil: { label: 'Perfil', icon: 'user' },
};

/** Marca PAUSA: triple toque = reiniciar prototipo; mantener 2 s = modo presentador. */
export function Brand() {
  const { reset, setPresenterOpen } = useApp();
  const taps = useRef(0); const tapTimer = useRef<number>(0); const holdTimer = useRef<number>(0);
  const down = () => {
    taps.current += 1; window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => { taps.current = 0; }, 700);
    if (taps.current >= 3) { taps.current = 0; reset(); return; }
    holdTimer.current = window.setTimeout(() => { void haptic('medium'); setPresenterOpen(true); }, 2000);
  };
  const up = () => window.clearTimeout(holdTimer.current);
  return <span className="topbar__brand" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={(e) => e.preventDefault()}>PAUSA</span>;
}

export function TopBar({ back, right = 'avatar' }: { back?: boolean; right?: 'avatar' | 'none' }) {
  const { back: goBack, goTab } = useApp();
  return (
    <header className="topbar">
      <div className="topbar__side">
        {back ? <button className="iconbtn" aria-label="Atrás" onClick={goBack}><Icon name="back" /></button>
          : <Icon name="logo" size={26} color="var(--c-acento)" />}
      </div>
      <Brand />
      <div className="topbar__side">
        {right === 'avatar' && <button className="avatar av-blue" aria-label="Perfil" onClick={() => goTab('perfil')}>{PERSONA.iniciales}</button>}
      </div>
    </header>
  );
}

export function TabBar() {
  const { state, goTab } = useApp();
  return (
    <nav className="tabbar" aria-label="Secciones">
      {TABS.map((t) => {
        const active = state.tab === t;
        return (
          <button key={t} className={`tab ${active ? 'tab--active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => { if (!active) { void haptic('light'); goTab(t); } }}>
            {active && <span className="tab__pill" />}
            <Icon name={TAB_META[t].icon} />
            {TAB_META[t].label}
            {t === 'docs' && state.tramiteListo && <span className="tab__dot" aria-label="Documentos nuevos" />}
          </button>
        );
      })}
    </nav>
  );
}

export function Screen({ children, back, tabs, cta, center, bar = true, right, className = '' }:
  { children: ReactNode; back?: boolean; tabs?: boolean; cta?: ReactNode; center?: boolean; bar?: boolean; right?: 'avatar' | 'none'; className?: string }) {
  return (
    <div className={`screen ${center ? 'screen--center' : ''} ${className}`}>
      {bar && <TopBar back={back} right={right} />}
      <div className={`screen__scroll ${cta ? 'screen__scroll--cta' : ''} ${tabs ? 'screen__scroll--tabs' : ''}`}>{children}</div>
      {cta && <div className={`cta ${tabs ? 'cta--tabs' : ''}`}>{cta}</div>}
      {tabs && <TabBar />}
    </div>
  );
}
