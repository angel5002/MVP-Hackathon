import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { SEMANA } from '../data/red';
import { semanaActual, fmtDiaMes, addDias } from '../logic/fechas';
import { haptic } from '../platform/native';

const R = 52, C = 2 * Math.PI * R;

/** Anillo de ritmo: se llena al entrar. */
export function Ring({ estado, dias, dark = false }: { estado: 'elevado' | 'pausa'; dias: number; dark?: boolean }) {
  const rm = useReducedMotion();
  const frac = estado === 'pausa' ? 0.2 : 0.72;
  const color = estado === 'pausa' ? 'var(--c-exito-acento)' : 'var(--c-alerta-acento)';
  return (
    <div className="ring" role="img" aria-label={estado === 'pausa' ? `Tu ritmo: en pausa, ${dias} días` : `Tu ritmo: elevado, ${dias} días sin desconectar`}>
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke={dark ? 'rgba(255,255,255,.14)' : 'var(--gris-200)'} strokeWidth="10" />
        <motion.circle cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: rm ? C * (1 - frac) : C }} animate={{ strokeDashoffset: C * (1 - frac) }}
          transition={{ duration: rm ? 0 : 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }} />
      </svg>
      <div className="ring__in" style={{ color: dark ? '#fff' : undefined }}>
        <span className="cap" style={{ color: dark ? 'rgba(255,255,255,.66)' : undefined }}>Tu ritmo</span>
        <span className="ring__v">{estado === 'pausa' ? 'En pausa' : 'Elevado'}</span>
        <span className="cap" style={{ color: dark ? 'rgba(255,255,255,.66)' : undefined }}>{dias} días</span>
      </div>
    </div>
  );
}

/** Tira de la semana (estilo agenda): días con la fecha, hoy resaltado, punto en los días con actividad nocturna. */
export function WeekStrip() {
  const { lunes, indiceHoy } = semanaActual();
  const DC = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  return (
    <div className="week-strip" role="list" aria-label="Semana actual">
      {DC.map((d, i) => {
        const f = addDias(lunes, i);
        return (
          <div key={d} role="listitem" className={`week-strip__d ${i === indiceHoy ? 'week-strip__d--hoy' : ''}`} aria-current={i === indiceHoy ? 'date' : undefined}>
            <span>{d}</span><b>{f.getDate()}</b>{SEMANA[i].late && i <= indiceHoy && <i aria-label="actividad después de las 11 pm" />}
          </div>
        );
      })}
    </div>
  );
}

/** Gráfico de horas conectada por día, con eje de horas, valor sobre cada barra y líneas de referencia. */
export function WeekBars() {
  const rm = useReducedMotion();
  const { lunes, domingo, indiceHoy } = semanaActual();
  const max = 14;
  const letras = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const total = SEMANA.reduce((a, d) => a + d.h, 0);
  const fmt = (h: number) => (Number.isInteger(h) ? `${h}` : h.toFixed(1).replace('.', ','));
  const ejes = [14, 10.5, 7, 3.5, 0];
  return (
    <section aria-label="Horas conectada por día">
      <div className="row" style={{ minHeight: 0, alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div><h2 className="h2">Horas conectada</h2><p className="cap">{lunes.getDate()} al {fmtDiaMes(domingo)}</p></div>
        <div className="h2" style={{ whiteSpace: 'nowrap' }}>{Math.round(total)} h <span className="cap">esta semana</span></div>
      </div>
      <div className="chart" role="img" aria-label={`${Math.round(total)} horas conectada esta semana. Eje en horas de 0 a 14.`}>
        <div className="chart__y" aria-hidden="true">{ejes.map((e) => <span key={e}>{e === 0 ? '0' : `${fmt(e)} h`}</span>)}</div>
        <div className="chart__plot">
          {ejes.map((e) => <div key={e} className="chart__grid" style={{ top: `${(1 - e / max) * 100}%` }} aria-hidden="true" />)}
          <div className="chart__bars">
            {SEMANA.map((d, i) => (
              <div key={i} className={`bar ${d.late ? 'bar--late' : ''}`} title={`${fmt(d.h)} horas`}>
                <motion.span className="bar__v" style={{ bottom: `${(d.h / max) * 100}%` }} initial={{ opacity: rm ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: rm ? 0 : 0.5 + i * 0.05 }}>{fmt(d.h)}</motion.span>
                <motion.i className="bar__fill" style={{ height: `${(d.h / max) * 100}%`, display: 'block' }}
                  initial={{ scaleY: rm ? 1 : 0 }} animate={{ scaleY: 1 }} transition={{ duration: rm ? 0 : 0.65, delay: rm ? 0 : 0.15 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="days"><span /><div className="days__l">{letras.map((l, i) => <span key={l} className={i === indiceHoy ? 'hoy' : ''}>{l}</span>)}</div></div>
      <div className="legend"><span><i style={{ background: 'var(--c-acento-fuerte)' }} />Horas conectada</span><span><i style={{ background: 'var(--c-alerta)' }} />Con actividad después de las 11 pm</span></div>
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
