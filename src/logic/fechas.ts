import type { SlotDef } from '../types';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const hoy = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const addDias = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mismoDia = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const fechaSlot = (s: SlotDef) => {
  const d = addDias(hoy(), s.offsetDias);
  const [h, m] = s.hora.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

/** '16:30' → '4:30 pm' */
export const hora12 = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suf = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suf}`;
};
export const horaDe = (d: Date) => hora12(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);

/** Etiqueta del día de un horario: Hoy · Mañana · Mié 16 */
export const diaLabel = (s: SlotDef) => {
  if (s.offsetDias === 0) return 'Hoy';
  if (s.offsetDias === 1) return 'Mañana';
  const d = addDias(hoy(), s.offsetDias);
  return `${DIAS_CORTO[d.getDay()]} ${d.getDate()}`;
};
export const slotTexto = (s: SlotDef) => `${diaLabel(s)}, ${hora12(s.hora)}`;

export const fmtCorto = (d: Date) => `${DIAS_CORTO[d.getDay()]} ${d.getDate()}`;
export const fmtDiaMes = (d: Date) => `${d.getDate()} de ${MESES[d.getMonth()]}`;
export const fmtLargo = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
export const fmtCompleto = (d: Date) => `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
export const fmtNumerico = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
export const diaCorto = (d: Date) => DIAS_CORTO[d.getDay()];
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Del jueves 10 al lunes 14 de septiembre" (o con ambos meses si cambia) */
export const rangoTexto = (ini: Date, fin: Date) => {
  const mismoMes = ini.getMonth() === fin.getMonth();
  const a = `${DIAS[ini.getDay()]} ${ini.getDate()}${mismoMes ? '' : ' de ' + MESES[ini.getMonth()]}`;
  const b = `${DIAS[fin.getDay()]} ${fin.getDate()} de ${MESES[fin.getMonth()]}`;
  return `Del ${a} al ${b}`;
};
export const rangoCorto = (ini: Date, fin: Date) => {
  const mismoMes = ini.getMonth() === fin.getMonth();
  return `del ${ini.getDate()}${mismoMes ? '' : ' de ' + MESES[ini.getMonth()]} al ${fin.getDate()} de ${MESES[fin.getMonth()]}`;
};

const LETRAS: Record<number, string> = { 1: 'un', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez', 11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince', 20: 'veinte' };
export const enLetras = (n: number) => LETRAS[n] ?? String(n);

/** Semana actual de lunes a domingo (para el rótulo del gráfico). */
export const semanaActual = () => {
  const h = hoy();
  const dow = (h.getDay() + 6) % 7; // 0 = lunes
  const lunes = addDias(h, -dow);
  return { lunes, domingo: addDias(lunes, 6), indiceHoy: dow };
};
