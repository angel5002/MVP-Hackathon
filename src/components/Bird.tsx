import { motion, useReducedMotion } from 'motion/react';

/**
 * El pájaro de PAUSA, con la geometría del pájaro de stoic.: mira a la derecha, el lomo es una
 * diagonal larga que sube desde la cola hasta la punta del pico, el pecho cae casi vertical,
 * la base es plana con las esquinas redondeadas, el ojo es un arco blanco (párpado feliz) y se
 * apoya en dos patas finas con pies iguales hacia adelante; la cola sale por el borde izquierdo y se recorta. Recreado en SVG.
 * Animación ambiental mínima: respira 2 px y parpadea de vez en cuando. Solo transform y opacity.
 */
export function Bird({ size = 180, color = '#111214', eye = '#FFFFFF', className }: { size?: number; color?: string; eye?: string; className?: string }) {
  const rm = useReducedMotion();
  const h = size * (240 / 200);
  return (
    <svg className={className} width={size} height={h} viewBox="0 0 200 240" fill="none" aria-hidden="true" style={{ overflow: 'visible', display: 'block' }}>
      {/* Patas y pies (quietos, apoyados en la base) */}
      <g stroke={color} strokeWidth="3.4" strokeLinecap="round">
        <path d="M70 209v27M70 236h20" />
        <path d="M92 209v27M92 236h20" />
      </g>
      {/* Cuerpo: lomo diagonal → punta del pico → pecho vertical → base plana */}
      <motion.g style={{ transformOrigin: '80px 210px' }}
        animate={rm ? undefined : { y: [0, -2, 0], rotate: [0, -0.6, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
        <path fill={color} d="M150 24 C141 19 120 22 104 31 C78 46 46 92 22 150 C14 168 2 186 -16 200 C-22 205 -20 211 -8 211 L98 211 C119 211 132 200 132 178 L132 82 C132 68 135 58 139 48 C143 40 148 31 150 24 Z" />
        {/* Ojo: arco blanco, con un parpadeo breve */}
        <motion.path d="M97 60 Q104 49 111 60" stroke={eye} strokeWidth="3" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '104px 58px' }}
          animate={rm ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 7, times: [0, 0.86, 0.9, 0.94, 1], repeat: Infinity, ease: 'easeInOut' }} />
      </motion.g>
    </svg>
  );
}
