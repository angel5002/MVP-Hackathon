import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useApp } from '../nav/store';
import { avisoSVG, certSVG, nombreArchivo, svgAPng } from '../logic/docs';
import { CARPETA_DESCARGAS, compartirPng, esNativo, guardarPng } from '../platform/native';
import { Button } from './ui';
import { Icon } from './icons';
import type { DocKind } from '../types';

/** Descarga (Documentos/PAUSA en Android, descarga del navegador en web) o comparte el PNG de un documento. Solo con el trámite terminado. */
export function useDescarga() {
  const { state, toast } = useApp();
  const [ocupado, setOcupado] = useState(false);
  const titulo = (k: DocKind) => (k === 'aviso' ? 'Aviso de ausencia' : 'Certificado médico');
  const generar = useCallback((k: DocKind) => svgAPng(k === 'aviso' ? avisoSVG(state) : certSVG(state)), [state]);
  const descargar = useCallback(async (k: DocKind) => {
    if (!state.tramiteListo) { toast('Se habilita al terminar el trámite'); return; }
    if (ocupado) return;
    setOcupado(true);
    try {
      const r = await guardarPng(nombreArchivo(k), await generar(k));
      toast(r.modo === 'guardado' ? `Guardado en ${CARPETA_DESCARGAS}` : `Descargando ${nombreArchivo(k)}`);
    } catch { toast('No se pudo guardar el documento'); }
    finally { setOcupado(false); }
  }, [state.tramiteListo, generar, toast, ocupado]);
  const compartir = useCallback(async (k: DocKind) => {
    if (!state.tramiteListo) { toast('Se habilita al terminar el trámite'); return; }
    if (ocupado) return;
    setOcupado(true);
    try {
      const ok = await compartirPng(nombreArchivo(k), await generar(k), titulo(k));
      if (!ok && !esNativo()) toast('Tu navegador no permite compartir archivos; usa Descargar');
    } catch { toast('No se pudo compartir el documento'); }
    finally { setOcupado(false); }
  }, [state.tramiteListo, generar, toast, ocupado]);
  return { descargar, compartir, ocupado };
}

export function Viewer() {
  const { viewerDoc, setViewerDoc, state } = useApp();
  const rm = useReducedMotion();
  const { descargar, compartir, ocupado } = useDescarga();
  const svg = useMemo(() => (viewerDoc === 'aviso' ? avisoSVG(state) : viewerDoc === 'cert' ? certSVG(state) : ''), [viewerDoc, state]);
  return (
    <AnimatePresence>
      {viewerDoc && (
        <motion.div className="viewer" role="dialog" aria-modal="true" aria-label={viewerDoc === 'aviso' ? 'Aviso de ausencia' : 'Certificado de descanso médico'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="viewer__top">
            <span className="label">{viewerDoc === 'aviso' ? 'Aviso de ausencia' : 'Certificado médico'}</span>
            <button className="iconbtn iconbtn--round" aria-label="Cerrar" onClick={() => setViewerDoc(null)}><Icon name="x" /></button>
          </div>
          <motion.div className="viewer__paper" initial={{ y: rm ? 0 : 24 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="viewer__acts">
            <Button variant="tonal" disabled={ocupado} onClick={() => void compartir(viewerDoc)}><Icon name="share" size={20} />Compartir</Button>
            <Button variant="primary" disabled={ocupado} onClick={() => void descargar(viewerDoc)}><Icon name="download" size={20} color="#fff" />Descargar</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
