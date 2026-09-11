import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

/** Bottom sheet modal (nivel 2). Se cierra tocando el scrim o arrastrando hacia abajo. */
export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const rm = useReducedMotion();
  const host = typeof document !== 'undefined' ? document.querySelector('.app') : null;
  const nodo = (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} onClick={onClose}>
          <motion.div
            className="sheet" role="dialog" aria-modal="true" aria-label={label}
            onClick={(e) => e.stopPropagation()}
            initial={rm ? { opacity: 0 } : { y: '100%' }}
            animate={rm ? { opacity: 1 } : { y: 0 }}
            exit={rm ? { opacity: 0 } : { y: '100%' }}
            transition={rm ? { duration: 0.2 } : { type: 'spring', stiffness: 320, damping: 32 }}
            drag={rm ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 96 || info.velocity.y > 600) onClose(); }}
          >
            <div className="sheet__handle" aria-hidden="true" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return host ? createPortal(nodo, host) : nodo;
}
