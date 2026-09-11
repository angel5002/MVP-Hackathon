import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../nav/store';

/** Panel oculto (mantener el logo 2 s). Fuerza el escenario de días y acorta los loaders a un ciclo. */
export function PresenterPanel() {
  const { presenterOpen, setPresenterOpen, state, set, reset } = useApp();
  const p = state.presenter;
  const setP = (patch: Partial<typeof p>) => set({ presenter: { ...p, ...patch } });
  return (
    <AnimatePresence>
      {presenterOpen && (
        <motion.div className="presenter" role="dialog" aria-label="Modo presentador" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
          <div className="rowp" style={{ marginTop: 0 }}><b>Modo presentador</b><button className="btn btn--text" style={{ width: 'auto', color: '#fff', height: 40 }} onClick={() => setPresenterOpen(false)}>Cerrar</button></div>
          <div className="rowp"><span>Escenario de días de descanso</span></div>
          <div className="seg">
            <button className={p.forzarDias === null ? 'on' : ''} onClick={() => setP({ forzarDias: null })}>Auto</button>
            {[3, 4, 5, 6, 7].map((n) => <button key={n} className={p.forzarDias === n ? 'on' : ''} onClick={() => setP({ forzarDias: n })}>{n}</button>)}
          </div>
          <div className="rowp"><span>Loaders de respiración</span></div>
          <div className="seg">
            <button className={!p.unCiclo ? 'on' : ''} onClick={() => setP({ unCiclo: false })}>Completos</button>
            <button className={p.unCiclo ? 'on' : ''} onClick={() => setP({ unCiclo: true })}>Un ciclo</button>
          </div>
          <div className="rowp"><span>Días de descanso ya usados en el año</span></div>
          <div className="seg">
            <button className={p.diasPrevios === 0 ? 'on' : ''} onClick={() => setP({ diasPrevios: 0 })}>0</button>
            <button className={p.diasPrevios === 15 ? 'on' : ''} onClick={() => setP({ diasPrevios: 15 })}>15 (supera los 20)</button>
          </div>
          <div className="rowp"><span>Prototipo</span><button className="btn btn--text" style={{ width: 'auto', color: '#fff', height: 40 }} onClick={() => { reset(); setPresenterOpen(false); }}>Reiniciar</button></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
