import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useApp } from '../nav/store';
import { avisoSVG, certSVG, nombreArchivo, svgAPng } from '../logic/docs';
import { guardarPng } from '../platform/native';
import { Button } from './ui';
import { Icon } from './icons';
import type { DocKind } from '../types';

/** Descarga (web) o guarda y comparte (nativo) el PNG de un documento. */
export function useDescarga() {
  const { state, toast } = useApp();
  const [ocupado, setOcupado] = useState(false);
  const descargar = useCallback(async (k: DocKind) => {
    if (!state.tramiteListo) { toast('Se habilita al terminar el trámite'); return; }
    if (ocupado) return;
    setOcupado(true);
    try {
      const png = await svgAPng(k === 'aviso' ? avisoSVG(state) : certSVG(state));
      const r = await guardarPng(nombreArchivo(k), png, k === 'aviso' ? 'Aviso de ausencia' : 'Certificado médico');
      toast(r === 'compartido' ? 'Documento listo para guardar o enviar' : `Descargando ${nombreArchivo(k)}`);
    } catch { toast('No se pudo generar el documento'); }
    finally { setOcupado(false); }
  }, [state, toast, ocupado]);
  return { descargar, ocupado };
}

export function Viewer() {
  const { viewerDoc, setViewerDoc, state } = useApp();
  const rm = useReducedMotion();
  const { descargar, ocupado } = useDescarga();
  const svg = useMemo(() => (viewerDoc === 'aviso' ? avisoSVG(state) : viewerDoc === 'cert' ? certSVG(state) : ''), [viewerDoc, state]);
  return (
    <AnimatePresence>
      {viewerDoc && (
        <motion.div className="viewer" role="dialog" aria-modal="true" aria-label={viewerDoc === 'aviso' ? 'Aviso de ausencia' : 'Certificado de descanso médico'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <motion.div className="viewer__paper" initial={{ y: rm ? 0 : 24 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} dangerouslySetInnerHTML={{ __html: svg }} />
          {!state.tramiteListo && <p className="cap center" style={{ color: '#fff', padding: '12px 20px 0' }}>La descarga se habilita al terminar el trámite.</p>}
          <div className="viewer__acts">
            <Button variant="tonal" onClick={() => setViewerDoc(null)}>Cerrar</Button>
            <Button variant="primary" disabled={!state.tramiteListo || ocupado} onClick={() => void descargar(viewerDoc)}>
              <Icon name="download" size={20} color="#fff" />Descargar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
