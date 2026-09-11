import type { DatosReloj, Evaluacion, PatronLaboral, Profesional } from '../types';
import { addDias, enLetras } from './fechas';

/**
 * SIMULACIÓN PARA EL PROTOTIPO. No es un criterio clínico real.
 * Combina tres entradas y devuelve los días de descanso (3 a 7) que "indica" el médico ficticio.
 *
 * Tabla de decisión (misma tabla documentada en docs/decisiones.md, D-13):
 *   base                                   3 días
 *   días sin desconectar > 12 h ≥ 7        +1
 *   días sin desconectar > 12 h ≥ 14       +1 adicional
 *   noches con actividad después de 11 pm ≥ 3   +1
 *   PHQ-4 total 6–8 (moderado)             +1
 *   PHQ-4 total 9–12 (grave)               +2
 *   reloj conectado y sueño promedio < 6 h +1
 *   resultado acotado a [3, 7]
 */
export interface EntradasDescanso {
  phq4Total: number;
  patron: PatronLaboral;
  reloj: DatosReloj | null;
  medico: Profesional;
  fechaConsulta: Date;      // la pausa empieza el día de la teleconsulta
  forzarDias?: number | null; // modo presentador
}

export function evaluarDescanso(e: EntradasDescanso): Evaluacion {
  const detalle: string[] = ['Base: 3 días'];
  let dias = 3;
  if (e.patron.diasSinDesconectar >= 7) { dias += 1; detalle.push(`${e.patron.diasSinDesconectar} días sin desconectar más de 12 h: +1`); }
  if (e.patron.diasSinDesconectar >= 14) { dias += 1; detalle.push('Dos semanas o más sin desconectar: +1'); }
  if (e.patron.nochesTarde >= 3) { dias += 1; detalle.push(`${e.patron.nochesTarde} noches con actividad después de las 11 pm: +1`); }
  if (e.phq4Total >= 9) { dias += 2; detalle.push(`Tamizaje PHQ-4 de ${e.phq4Total}: +2`); }
  else if (e.phq4Total >= 6) { dias += 1; detalle.push(`Tamizaje PHQ-4 de ${e.phq4Total}: +1`); }
  if (e.reloj && e.reloj.suenoPromedioHoras < 6) { dias += 1; detalle.push(`Sueño promedio de ${e.reloj.suenoPromedioHoras.toString().replace('.', ',')} h según tu reloj: +1`); }
  dias = Math.max(3, Math.min(7, dias));
  if (e.forzarDias) { dias = Math.max(3, Math.min(7, e.forzarDias)); detalle.push(`Modo presentador: escenario de ${dias} días`); }

  const inicio = new Date(e.fechaConsulta); inicio.setHours(0, 0, 0, 0);
  const fin = addDias(inicio, dias - 1);
  const reincorporacion = addDias(fin, 1);

  return { dias, inicio, fin, reincorporacion, medicoId: e.medico.id, detalle, fundamento: fundamento(e, dias) };
}

function fundamento(e: EntradasDescanso, dias: number): string {
  const partes: string[] = [];
  partes.push(`${enLetras(e.patron.diasSinDesconectar)} días seguidos de más de doce horas`);
  if (e.patron.nochesTarde >= 3) partes.push(`${enLetras(e.patron.nochesTarde)} noches trabajando pasadas las once`);
  if (e.reloj && e.reloj.suenoPromedioHoras < 6) partes.push('un sueño que no llega a seis horas');
  const tam = e.phq4Total >= 9 ? 'lo que me contaste en la consulta y en el tamizaje pesa bastante'
    : e.phq4Total >= 6 ? 'lo que me contaste en el tamizaje también cuenta'
    : 'lo que me contaste en la consulta lo confirma';
  const cierre = dias >= 6
    ? 'Necesitas desconexión completa y un control antes de volver.'
    : dias >= 4
      ? 'Cinco días de desconexión completa es lo que corresponde. Nos vemos en el control.'.replace('Cinco', capitalizar(enLetras(dias)))
      : 'Tres días de desconexión completa y nos vemos en el control.';
  const lista = partes.length > 1 ? partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1] : partes[0];
  return `Con ${lista}, ${tam}. ${cierre}`;
}

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
