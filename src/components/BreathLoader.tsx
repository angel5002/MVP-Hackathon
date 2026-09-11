import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { haptic } from '../platform/native';

/** Duraciones del ciclo (tokens): 4 s inhalar + 6 s exhalar = 10 s → 6 respiraciones por minuto (< 10 rpm). */
export const RESPIRA = { inhala: 4, exhala: 6 };
export const CICLO_MS = (RESPIRA.inhala + RESPIRA.exhala) * 1000;

type Fase = 'inhala' | 'exhala';

/**
 * Loader de respiración. Corre `ciclos` ciclos completos y entonces llama a `onListo`.
 * Nunca corta una fase: la salida solo ocurre al terminar una exhalación.
 * Si se pasa `salida`, tras completar los ciclos muestra ese nodo y sigue respirando.
 * El reloj de fases va por temporizadores (no por eventos de animación) para no depender
 * de requestAnimationFrame si el WebView deja de pintar un momento.
 */
export function BreathLoader({ estado, ciclos, onListo, salida, contador = false }:
  { estado: string; ciclos: number; onListo?: () => void; salida?: ReactNode; contador?: boolean }) {
  const rm = useReducedMotion();
  const [fase, setFase] = useState<Fase>('inhala');
  const [hechos, setHechos] = useState(0);
  const [listo, setListo] = useState(false);
  const onListoRef = useRef(onListo); onListoRef.current = onListo;

  useEffect(() => {
    let vivo = true;
    let n = 0;
    let t = 0;
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
  const trans = { duration: dur, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] };
  const palabra = fase === 'inhala' ? 'Inhala' : 'Exhala';
  const cuenta = contador ? `${hechos} ${hechos === 1 ? 'respiración' : 'respiraciones'}` : null;

  return (
    <div className="breath" role="status" aria-live="polite" aria-label={estado}>
      {rm && (
        /* Movimiento reducido: sin desplazamiento; un tinte bajo el texto que aparece y desaparece */
        <motion.div className="breath__fill breath__fill--rm" initial={{ opacity: 0 }} animate={{ opacity: fase === 'inhala' ? 1 : 0 }} transition={trans} aria-hidden="true" />
      )}

      {/* Capa 1: texto navy sobre crema */}
      <div className="breath__layer breath__layer--navy" aria-hidden="true">
        <Palabra texto={palabra} />
        <div className="breath__status">{estado}</div>
        {cuenta && <div className="breath__count">{cuenta}</div>}
      </div>

      {!rm && (
        /* Relleno que sube y baja con translateY; dentro, el mismo texto en blanco con contra-transformación */
        <motion.div className="breath__fill" initial={{ y: '100%' }} animate={{ y: fase === 'inhala' ? '0%' : '100%' }} transition={trans} aria-hidden="true">
          <motion.div className="breath__layer breath__layer--white" initial={{ y: '-100%' }} animate={{ y: fase === 'inhala' ? '0%' : '-100%' }} transition={trans}>
            <Palabra texto={palabra} />
            <div className="breath__status">{estado}</div>
            {cuenta && <div className="breath__count">{cuenta}</div>}
          </motion.div>
        </motion.div>
      )}

      {salida && (
        <AnimatePresence>
          {listo && (
            <motion.div className="breath__exit" initial={{ opacity: 0, y: rm ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
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
    <div style={{ position: 'relative', height: '3rem', width: '100%' }}>
      <AnimatePresence initial={false}>
        <motion.div key={texto} className="breath__word" style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {texto}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
