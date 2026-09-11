import { MED, PERSONA, byId } from '../data/red';
import type { AppState, Destinatario } from '../types';
import { enLetras, fmtCompleto, rangoCorto } from './fechas';
import { numeroCert } from './docs';

export interface Correo { to: string; asunto: string; cuerpo: string; adjunto: 'cert' | 'aviso'; campos: string[]; }

/**
 * Dos destinatarios, dos contenidos (decisión D-16):
 *  - jefe directo: aviso de ausencia SIN diagnóstico, adjunta el aviso.
 *  - RR. HH.: remite el certificado; el cuerpo tampoco repite el diagnóstico, solo lo adjunta.
 */
export function construirCorreo(s: AppState, dest: Destinatario = s.correoDest): Correo {
  const ev = s.evaluacion;
  const m = byId(MED, ev?.medicoId ?? s.medId);
  const jefe = s.jefeNombre.trim() || 'Nombre de tu jefe o jefa';
  if (!ev) return { to: '', asunto: '', cuerpo: '', adjunto: 'aviso', campos: [] };
  const dias = `${ev.dias} días`;
  const rango = rangoCorto(ev.inicio, ev.fin);
  const retorno = fmtCompleto(ev.reincorporacion);

  if (dest === 'jefe') {
    const cuerpo =
      `Hola ${jefe},\n\n` +
      `Por indicación médica tomaré una pausa de ${dias}, ${rango}. Me reincorporo el ${retorno}.\n\n` +
      `El certificado ya fue entregado a Recursos Humanos. Dejo mis pendientes organizados y avisados al equipo.\n\n` +
      `Gracias por la comprensión.\n\n${PERSONA.nombreCompleto} · ${PERSONA.cargo}`;
    return { to: s.correoJefe.trim(), asunto: `Aviso de ausencia · ${PERSONA.nombreCompleto}`, cuerpo, adjunto: 'aviso', campos: [jefe, dias, rango, retorno] };
  }
  const cuerpo =
    `Estimado equipo de Recursos Humanos,\n\n` +
    `Adjunto el certificado de descanso médico N.º ${numeroCert(s)} por ${enLetras(ev.dias)} (${ev.dias}) días, ${rango}. Me reincorporo el ${retorno}.\n\n` +
    `Fue emitido por ${m.nombre} (${m.cmp}) a través de la red PAUSA de Pacífico Seguros, con colegiatura verificada en el registro del CMP.\n\n` +
    `Quedo atenta a cualquier trámite adicional.\n\n${PERSONA.nombreCompleto} · ${PERSONA.cargo}`;
  return { to: s.correoRrhh.trim(), asunto: `Certificado de descanso médico · ${PERSONA.nombreCompleto}`, cuerpo, adjunto: 'cert', campos: [dias, rango, retorno, `${m.nombre} (${m.cmp})`] };
}

export function urlCorreo(via: 'gmail' | 'outlook' | 'otro', c: Correo) {
  const to = encodeURIComponent(c.to), su = encodeURIComponent(c.asunto), bo = encodeURIComponent(c.cuerpo);
  if (via === 'gmail') return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${bo}`;
  if (via === 'outlook') return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${bo}`;
  return `mailto:${to}?subject=${su}&body=${bo}`;
}
