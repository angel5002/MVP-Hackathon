import { motion, useReducedMotion } from 'motion/react';

/**
 * Ilustración de la tarjeta de ingreso: una cabeza dibujada a línea con un hilo enredado dentro,
 * en trazo azul con brillo, sobre un cielo con puntos. Inspirada en la introducción de stoic.,
 * adaptada a los tonos de PAUSA. El hilo se dibuja y se deshace en bucle lento (solo `pathLength`,
 * `opacity` y `transform`); con movimiento reducido queda estático.
 */
export function MindDoodle({ className }: { className?: string }) {
  const rm = useReducedMotion();
  const estrellas = [[24, 18, 1.6], [58, 40, 1.1], [96, 12, 1.4], [140, 34, 1], [176, 20, 1.8], [206, 48, 1.2], [232, 14, 1], [252, 40, 1.5], [116, 56, 0.9], [20, 66, 1]];
  const hilo = 'M96 96 c14 -16 40 -14 44 4 c4 16 -20 20 -30 8 c-10 -12 8 -30 26 -22 c18 8 12 34 -8 36 c-20 2 -34 -18 -22 -34 c12 -16 42 -10 44 10 c2 20 -24 28 -38 14 c-14 -14 4 -40 24 -32 c20 8 16 36 -4 38';
  return (
    <svg className={className} viewBox="0 0 270 190" fill="none" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 6px rgba(77,189,232,.55))' }}>
      {estrellas.map(([x, y, r], i) => (
        <motion.circle key={i} cx={x} cy={y} r={r} fill="#8FD6F3"
          animate={rm ? undefined : { opacity: [0.25, 0.9, 0.25] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
      ))}
      {/* Cabeza y hombros, a línea */}
      <motion.path d="M62 190 C64 150 70 118 82 100 C96 78 118 68 138 70 C160 72 180 86 190 108 C200 130 202 158 204 190" stroke="#4DBDE8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={rm ? undefined : { pathLength: 0 }} animate={rm ? undefined : { pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
      {/* Hilo enredado, más grande y centrado en la cabeza: se dibuja en 4 s, respira y se deshace en bucle */}
      <g transform="translate(133 118) scale(1.55) translate(-129 -90)">
        <motion.path d={hilo} stroke="#F5F5F2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(245,245,242,.6))' }}
          initial={rm ? undefined : { pathLength: 0 }}
          animate={rm ? undefined : { pathLength: 1 }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.6, delay: 0.6 }} />
      </g>
    </svg>
  );
}
