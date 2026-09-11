import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { SEMANA } from '../data/red';
import { semanaActual, fmtDiaMes } from '../logic/fechas';
import { haptic } from '../platform/native';
import { addDias } from '../logic/fechas';

const R = 54, C = 2 * Math.PI * R;

/** Anillo de ritmo: se llena al entrar (única animación ambiental del Inicio). */
export function Ring({ estado, dias }: { estado: 'elevado' | 'pausa'; dias: number }) {
  const rm = useReducedMotion();
  const frac = estado === 'pausa' ? 0.2 : 0.72;
  const color = estado === 'pausa' ? 'var(--c-exito)' : 'var(--c-alerta)';
  return (
    <div className="ring" role="img" aria-label={estado === 'pausa' ? `Tu ritmo: en pausa, ${dias} días` : `Tu ritmo: elevado, ${dias} días sin desconectar`}>
      <svg viewBox="0 0 124 124">
        <circle cx="62" cy="62" r={R} fill="none" stroke="var(--crema-200)" strokeWidth="12" />
        <motion.circle cx="62" cy="62" r={R} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: rm ? C * (1 - frac) : C }} animate={{ strokeDashoffset: C * (1 - frac) }}
          transition={{ duration: rm ? 0 : 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }} />
      </svg>
      <div className="ring__in">
        <span className="cap">Tu ritmo</span>
        <span className="ring__v" style={{ color }}>{estado === 'pausa' ? 'En pausa' : 'Elevado'}</span>
        <span className="cap">{dias} días</span>
      </div>
    </div>
  );
}

export function WeekBars() {
  const rm = useReducedMotion();
  const { lunes, domingo, indiceHoy } = semanaActual();
  const max = 12.5;
  const letras = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const total = SEMANA.reduce((a, d) => a + d.h, 0);
  return (
    <section className="week" aria-label="Horas conectada por día">
      <div className="week__hd"><h2 className="h2" style={{ whiteSpace: 'nowrap' }}>Horas conectada</h2><span className="cap" style={{ whiteSpace: 'nowrap' }}>{lunes.getMonth() === domingo.getMonth() ? `${lunes.getDate()} al ${fmtDiaMes(domingo)}` : `${fmtDiaMes(lunes)} al ${fmtDiaMes(domingo)}`}</span></div>
      <div className="bars" role="img" aria-label={`${Math.round(total)} horas conectada esta semana`}>
        {SEMANA.map((d, i) => (
          <div key={i} className={`bar ${d.late ? 'bar--late' : ''}`}>
            <motion.i className="bar__fill" style={{ height: `${(d.h / max) * 100}%`, display: 'block' }}
              initial={{ scaleY: rm ? 1 : 0 }} animate={{ scaleY: 1 }} transition={{ duration: rm ? 0 : 0.6, delay: rm ? 0 : 0.15 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }} />
          </div>
        ))}
      </div>
      <div className="days">{letras.map((l, i) => <span key={l} className={i === indiceHoy ? 'hoy' : ''}>{l}</span>)}</div>
      <div className="legend"><span><i style={{ background: 'var(--c-primario)' }} />Horas por día</span><span><i style={{ background: 'var(--c-alerta)' }} />Con actividad después de las 11 pm</span></div>
    </section>
  );
}

/** Tira de calendario: los N días se encienden uno a uno, con un toque háptico por día. */
export function CalendarStrip({ inicio, dias, animar = true }: { inicio: Date; dias: number; animar?: boolean }) {
  const rm = useReducedMotion();
  const [encendidos, setEncendidos] = useState(animar ? 0 : dias);
  useEffect(() => {
    if (!animar) { setEncendidos(dias); return; }
    setEncendidos(0);
    const ids: number[] = [];
    for (let i = 1; i <= dias; i++) ids.push(window.setTimeout(() => { setEncendidos(i); void haptic('light'); }, 400 + i * 380));
    return () => ids.forEach((t) => window.clearTimeout(t));
  }, [dias, animar, inicio]);
  const celdas = Array.from({ length: 7 }, (_, i) => addDias(inicio, i));
  const DC = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return (
    <div className="strip" role="img" aria-label={`${dias} días de descanso a partir del ${fmtDiaMes(inicio)}`}>
      {celdas.map((d, i) => {
        const on = i < encendidos;
        return (
          <motion.div key={i} className={`cell ${on ? 'cell--on' : ''}`} animate={on && !rm ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.28 }}>
            <small>{DC[d.getDay()]}</small><b>{d.getDate()}</b>
          </motion.div>
        );
      })}
    </div>
  );
}
