import { motion, useReducedMotion } from 'motion/react';

/**
 * El pájaro de PAUSA: silueta negra minimalista (cuerpo redondeado, cola alzada, pico corto,
 * ojo blanco cerrado) sobre dos patas finas, al estilo de la introducción de stoic. Recreado en SVG.
 * Animación ambiental única: respira (sube y baja 3 px) y parpadea de vez en cuando. Solo transform y opacity.
 */
export function Bird({ size = 180, className }: { size?: number; className?: string }) {
  const rm = useReducedMotion();
  return (
    <svg className={className} width={size} height={size * (200 / 180)} viewBox="0 0 180 200" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      {/* Patas */}
      <g stroke="#16181C" strokeWidth="3" strokeLinecap="round">
        <path d="M78 176v22M78 198h-9M78 198h8" />
        <path d="M104 176v22M104 198h-9M104 198h8" />
      </g>
      {/* Cuerpo + cabeza + cola, con la respiración */}
      <motion.g style={{ transformOrigin: '92px 176px' }}
        animate={rm ? undefined : { y: [0, -3, 0], rotate: [0, -1.2, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
        <path fill="#16181C" d="M30 26 C34 22 40 24 42 30 L64 90 C70 62 88 44 114 44 C146 44 168 72 166 112 C164 150 140 176 106 178 L72 178 C50 176 34 160 30 138 C26 118 30 104 40 94 L26 40 C24 34 26 29 30 26 Z" />
        {/* Pico */}
        <path fill="#16181C" d="M162 84 L178 90 L162 98 Z" />
        {/* Ojo: párpado cerrado, con parpadeo (abre un instante) */}
        <motion.path d="M124 80 Q132 72 140 80" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '132px 78px' }}
          animate={rm ? undefined : { scaleY: [1, 1, -0.9, 1, 1] }}
          transition={{ duration: 6, times: [0, 0.82, 0.86, 0.9, 1], repeat: Infinity, ease: 'easeInOut' }} />
      </motion.g>
    </svg>
  );
}
