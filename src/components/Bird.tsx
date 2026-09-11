import { motion, useReducedMotion } from 'motion/react';

/**
 * El pájaro de PAUSA, calcado del pájaro de stoic. (pantalla "meet stoic."): mira a la derecha;
 * la punta del pico es el vértice superior derecho; desde ahí el lomo baja hacia la izquierda en
 * una sola curva convexa hasta la cola, que sale por el borde izquierdo y se recorta; el pecho cae
 * recto bajo el pico y el vientre se redondea hasta una base casi plana. Ojo: arco blanco. Dos patas
 * finas, sin pies. Coordenadas tomadas de la referencia (escala 1:3).
 * Animación ambiental mínima: respira 2 px y parpadea de vez en cuando. Solo transform y opacity.
 */
export function Bird({ size = 180, color = '#111214', eye = '#FFFFFF', className }: { size?: number; color?: string; eye?: string; className?: string }) {
  const rm = useReducedMotion();
  const h = size * (254 / 200);
  return (
    <svg className={className} width={size} height={h} viewBox="0 0 200 254" fill="none" aria-hidden="true" style={{ overflow: 'hidden', display: 'block' }}>
      {/* Patas: dos palitos, sin pies (la línea horizontal de la referencia es el suelo, no un pie) */}
      <g stroke={color} strokeWidth="3.2" strokeLinecap="round">
        <path d="M68 214v36" />
        <path d="M95 214v36" />
      </g>
      <motion.g style={{ transformOrigin: '80px 223px' }}
        animate={rm ? undefined : { y: [0, -2, 0], rotate: [0, -0.5, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Cuerpo: pico → lomo convexo → cola (fuera del borde) → base → vientre → pecho recto → pico */}
        <path fill={color} d="M167 3 C150 -1 128 6 110 15 C80 30 45 78 18 128 C10 143 3 155 -8 168 L-8 214 C20 223 50 226 80 222 C118 216 147 190 147 140 L147 58 C148 40 156 20 167 3 Z" />
        {/* Ojo: arco blanco (párpado feliz), con un parpadeo breve */}
        <motion.path d="M105 45 A10 10 0 0 1 125 45" stroke={eye} strokeWidth="2.8" strokeLinecap="round" fill="none"
          style={{ transformOrigin: '115px 43px' }}
          animate={rm ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 7, times: [0, 0.86, 0.9, 0.94, 1], repeat: Infinity, ease: 'easeInOut' }} />
      </motion.g>
    </svg>
  );
}
