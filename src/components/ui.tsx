import type { ReactNode } from 'react';
import type { ChipKind, ColorKey, Profesional, SlotDef } from '../types';
import { diaLabel, hora12 } from '../logic/fechas';
import { Icon } from './icons';
import { haptic } from '../platform/native';

type Variant = 'primary' | 'tonal' | 'outline' | 'text' | 'alerta' | 'surface' | 'acento' | 'ghost-light';

export function Button({ variant = 'primary', onClick, disabled, children, className = '', left, haptica, type = 'button', ariaLabel }:
  { variant?: Variant; onClick?: () => void; disabled?: boolean; children: ReactNode; className?: string; left?: boolean; haptica?: 'light' | 'medium' | 'success'; type?: 'button' | 'submit'; ariaLabel?: string }) {
  return (
    <button type={type} aria-label={ariaLabel} className={`btn btn--${variant} ${left ? 'btn--left' : ''} ${className}`} disabled={disabled}
      onClick={() => { if (haptica) void haptic(haptica); onClick?.(); }}>
      {children}
    </button>
  );
}

export function Chip({ kind, children }: { kind: ChipKind; children: ReactNode }) {
  return <span className={`chip chip--${kind}`}>{children}</span>;
}

export function Avatar({ ini, color, size }: { ini: string; color: ColorKey; size?: 'lg' | 'xl' }) {
  return <span className={`avatar av-${color} ${size ? 'avatar--' + size : ''}`} aria-hidden="true">{ini}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'toggle--on' : ''}`} onClick={() => { void haptic('light'); onChange(!on); }} />;
}

/** Tarjeta de profesional: única superficie de nivel 1 en las listas. */
export function ProCard({ p, selected, onClick, extra, tap = true }: { p: Profesional; selected?: boolean; onClick?: () => void; extra?: ReactNode; tap?: boolean }) {
  const inner = (
    <>
      <Avatar ini={p.ini} color={p.color} size="lg" />
      <div className="row__grow">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div className="row__grow">
            <div className="h2">{p.nombre}</div>
            <div className="cap mt-1">{p.rol}</div>
            {p.cmp && <div className="cap">{p.cmp}</div>}
          </div>
          {p.rating && <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 'none' }}><Icon name="star" size={14} color="#B23A17" /> {p.rating}</div>}
        </div>
        <div className="chips mt-3">{p.tags.map(([k, t]) => <Chip key={t} kind={k}>{t}</Chip>)}</div>
        {extra}
      </div>
    </>
  );
  if (!tap) return <div className="pro">{inner}</div>;
  return (
    <button className={`pro pro--tap ${selected ? 'pro--sel' : ''}`} onClick={() => { void haptic('light'); onClick?.(); }} aria-pressed={selected}>
      {inner}
    </button>
  );
}

export function Slots({ slots, sel, onSel, nota }: { slots: SlotDef[]; sel: number | null; onSel: (i: number) => void; nota?: (s: SlotDef) => string | undefined }) {
  return (
    <div className="slots" role="radiogroup" aria-label="Horarios disponibles">
      {slots.map((s, i) => (
        <button key={i} role="radio" aria-checked={sel === i} className={`slot ${sel === i ? 'slot--sel' : ''}`} onClick={() => { void haptic('light'); onSel(i); }}>
          <small>{diaLabel(s)}</small><b>{hora12(s.hora)}</b>{nota && <small>{nota(s) ?? ' '}</small>}
        </button>
      ))}
    </div>
  );
}

export function Fila({ icon, title, sub, right, onClick }: { icon?: ReactNode; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void }) {
  const inner = (
    <>
      {icon}
      <div className="row__grow"><div className="label">{title}</div>{sub && <div className="cap">{sub}</div>}</div>
      {right && <div className="row__right">{right}</div>}
    </>
  );
  if (onClick) return <button className="row row--tap" onClick={() => { void haptic('light'); onClick(); }}>{inner}</button>;
  return <div className="row">{inner}</div>;
}

/** Bloque de sección: etiqueta pequeña en mayúsculas alineada al margen, contenido debajo y una nota opcional al pie. */
export function Seccion({ label, nota, children }: { label: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <section className="seccion">
      <h2 className="eyebrow">{label}</h2>
      {children}
      {nota && <p className="cap seccion__nota">{nota}</p>}
    </section>
  );
}

/** Tarjeta que solo contiene filas: todas comparten la misma sangría y van separadas por una línea fina. */
export function Lista({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`list ${className}`}>{children}</div>;
}

export function IconRound({ name, tone }: { name: Parameters<typeof Icon>[0]['name']; tone: 'alerta' | 'ok' | 'info' }) {
  const bg = tone === 'alerta' ? 'var(--c-alerta-tinte)' : tone === 'ok' ? 'var(--c-exito-tinte)' : 'var(--c-primario-tinte)';
  const fg = tone === 'alerta' ? 'var(--c-alerta)' : tone === 'ok' ? 'var(--c-exito)' : 'var(--c-texto)';
  return <div className="icon-round" style={{ background: bg, color: fg }}><Icon name={name} /></div>;
}
