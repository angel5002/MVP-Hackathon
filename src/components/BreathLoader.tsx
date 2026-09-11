import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { haptic } from '../platform/native';
import { Face } from './Face';

/** Ciclo: 4 s inhalar + 6 s exhalar = 10 s → 6 respiraciones por minuto (< 10 rpm). */
export const RESPIRA = { inhala: 4, exhala: 6 };
export const CICLO_MS = (RESPIRA.inhala + RESPIRA.exhala) * 1000;

type Fase = 'inhala' | 'exhala';

/** Posición del mar (fracción de la pantalla que cubre): sube al inhalar, baja al exhalar. */
const NIVEL = { alto: 0.66, bajo: 0.22 };

/**
 * Loader de respiración v2. Un "mar" azul con ola sube desde abajo mientras se lee "Inhala" y baja con
 * "Exhala"; una carita flota sobre la ola. El texto vive arriba, siempre sobre el fondo claro.
 * El reloj de fases usa temporizadores; nunca corta una exhalación: la salida solo ocurre al terminar una.
 */
export function BreathLoader({ estado, ciclos, onListo, salida, contador = false }:
  { estado: string; ciclos: number; onListo?: () => void; salida?: ReactNode; contador?: boolean }) {
  const rm = useReducedMotion();
  const [fase, setFase] = useState<Fase>('inhala');
  const [hechos, setHechos] = useState(0);
  const [listo, setListo] = useState(false);
  const onListoRef = useRef(onListo); onListoRef.current = onListo;

  useEffect(() => {
    let vivo = true, n = 0, t = 0;
    const paso = (f: Fase) => {
      if (!vivo) return;
      setFase(f); void haptic('light');
      if (f === 'inhala') { t = window.setTimeout(() => paso('exhala'), RESPIRA.inhala * 1000); return; }
      t = window.setTimeout(() => {
        if (!vivo) return;
        n += 1; setHechos(n);
        if (n >= ciclos) { setListo(true); onListoRef.current?.(); if (!salida) return; }
        paso('inhala');
      }, RESPIRA.exhala * 1000);
    };
    paso('inhala');
    return () => { vivo = false; window.clearTimeout(t); };
  }, [ciclos, salida]);

  const dur = fase === 'inhala' ? RESPIRA.inhala : RESPIRA.exhala;
  const trans = { duration: rm ? 0.8 : dur, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] };
  const nivel = fase === 'inhala' ? NIVEL.alto : NIVEL.bajo;
  // El mar es un bloque de 100 % de alto: translateY(100 % − nivel) deja visible la fracción `nivel`.
  const y = `${(1 - nivel) * 100}%`;
  const palabra = fase === 'inhala' ? 'Inhala' : 'Exhala';
  const cuenta = contador ? `${hechos} ${hechos === 1 ? 'respiración' : 'respiraciones'}` : null;

  return (
    <div className={`breath ${rm ? 'breath--rm' : ''}`} role="status" aria-live="polite" aria-label={estado}>
      <div className="breath__top" aria-hidden="true">
        <Palabra texto={palabra} />
        <div className="breath__status">{estado}</div>
        {cuenta && <div className="breath__count">{cuenta}</div>}
      </div>

      {/* Mar con ola: el bloque sube y baja con translateY; la ola se desplaza en X de forma continua */}
      <motion.div className="breath__sea" initial={{ y: '100%' }} animate={rm ? { y: `${(1 - NIVEL.bajo) * 100}%`, opacity: fase === 'inhala' ? 1 : 0.55 } : { y }} transition={trans} aria-hidden="true">
        <motion.svg viewBox="0 0 1600 1000" preserveAspectRatio="none"
          animate={rm ? undefined : { x: ['0%', '-50%'] }} transition={rm ? undefined : { duration: 9, ease: 'linear', repeat: Infinity }}>
          <defs>
            <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#33B3E5" /><stop offset="1" stopColor="#0077B6" />
            </linearGradient>
            <linearGradient id="espuma" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* dos periodos de ola en 1600 px para que el desplazamiento de −50 % sea continuo */}
          <path fill="url(#mar)" d="M0 40 C 130 0, 270 0, 400 40 S 670 80, 800 40 S 1070 0, 1200 40 S 1470 80, 1600 40 L1600 1000 L0 1000 Z" />
          <path fill="url(#espuma)" d="M0 70 C 130 30, 270 30, 400 70 S 670 110, 800 70 S 1070 30, 1200 70 S 1470 110, 1600 70 L1600 260 L0 260 Z" />
        </motion.svg>
        {/* La carita va dentro del mar (a 7 % bajo la superficie): se mueve con él usando solo transform */}
        <motion.div className="breath__face" style={{ top: '7%' }}
          animate={rm ? undefined : { x: [-96, 96], rotate: [-5, 5] }}
          transition={rm ? undefined : { duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}>
          <motion.div animate={{ scale: fase === 'inhala' ? 1.08 : 1, y: fase === 'inhala' ? -6 : 4 }} transition={trans}>
            <Face animo={fase === 'inhala' ? 'calma' : 'alivio'} color="#0F2E40" />
          </motion.div>
        </motion.div>
      </motion.div>

      {salida && (
        <AnimatePresence>
          {listo && (
            <motion.div className="breath__exit" initial={{ opacity: 0, y: rm ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {salida}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function Palabra({ texto }: { texto: string }) {
  return (
    <div style={{ position: 'relative', height: '2rem', width: '100%' }}>
      <AnimatePresence initial={false}>
        <motion.div key={texto} className="breath__word" style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5 }}>
          {texto}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
