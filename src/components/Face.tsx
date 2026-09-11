import { motion, useReducedMotion } from 'motion/react';

/**
 * La carita de PAUSA: dos ojos cerrados (arcos) y una sonrisa, en trazo de línea.
 * `animo`: 'calma' (inhala, sonrisa suave) · 'alivio' (exhala, sonrisa amplia) · 'atenta' (ojos abiertos, escucha).
 */
export function Face({ animo = 'calma', color = 'currentColor', size = 96 }: { animo?: 'calma' | 'alivio' | 'atenta'; color?: string; size?: number }) {
  const rm = useReducedMotion();
  const sonrisa = animo === 'alivio' ? 'M30 44 Q48 62 66 44' : 'M32 44 Q48 54 64 44';
  const ojo = (x: number) => (animo === 'atenta' ? `M${x - 7} 30 Q${x} 22 ${x + 7} 30` : `M${x - 7} 27 Q${x} 35 ${x + 7} 27`);
  return (
    <svg width={size} height={size * (64 / 96)} viewBox="0 0 96 64" fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path initial={false} d={ojo(30)} animate={{ d: ojo(30) }} transition={{ duration: rm ? 0 : 0.5 }} />
      <motion.path initial={false} d={ojo(66)} animate={{ d: ojo(66) }} transition={{ duration: rm ? 0 : 0.5 }} />
      {animo === 'atenta' && (<><circle cx="30" cy="29" r="2.2" fill={color} stroke="none" /><circle cx="66" cy="29" r="2.2" fill={color} stroke="none" /></>)}
      <motion.path initial={false} d={sonrisa} animate={{ d: sonrisa }} transition={{ duration: rm ? 0 : 0.6, ease: [0.2, 0.8, 0.2, 1] }} />
    </svg>
  );
}
