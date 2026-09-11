import { CIE10, LIMITE_DIAS_ANIO, MED, PERSONA, byId } from '../data/red';
import type { AppState } from '../types';
import { enLetras, fmtCompleto, fmtNumerico, horaDe, fechaSlot } from './fechas';

/**
 * Documentos generados como SVG propio. Maquetación deliberadamente distinta del formato del
 * Colegio Médico del Perú y del CITT de EsSalud: sin sus logos ni su estructura.
 */
const W = 794, H = 1123;
const FONT = 'font-family="Signika, Segoe UI, Roboto, Arial, sans-serif"';
const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (x: number, y: number, txt: string, size = 15, weight = 400, fill = '#003B5C', extra = '') =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(txt)}</text>`;
const lab = (x: number, y: number, txt: string) => t(x, y, txt, 12, 600, '#3F697E');
const line = (y: number) => `<line x1="56" y1="${y}" x2="${W - 56}" y2="${y}" stroke="#D7D7CF"/>`;

const marcaDeAgua = () =>
  `<text x="${W / 2}" y="${H / 2}" ${FONT} font-size="44" font-weight="700" fill="#B23A17" opacity=".13" text-anchor="middle" transform="rotate(-32 ${W / 2} ${H / 2})">CASO FICTICIO · PROTOTIPO SIN VALIDEZ LEGAL</text>` +
  `<text x="${W / 2}" y="${H / 2 + 56}" ${FONT} font-size="44" font-weight="700" fill="#B23A17" opacity=".13" text-anchor="middle" transform="rotate(-32 ${W / 2} ${H / 2 + 56})">CASO FICTICIO · PROTOTIPO SIN VALIDEZ LEGAL</text>`;

const pie = (txt: string) =>
  `<rect x="0" y="${H - 64}" width="${W}" height="64" fill="#FDF3E3"/>` +
  t(W / 2, H - 38, 'PROTOTIPO DE DEMOSTRACIÓN · Datos, profesionales y colegiaturas son ficticios · Sin validez legal', 12, 600, '#B23A17', 'text-anchor="middle"') +
  t(W / 2, H - 18, txt, 11, 400, '#3F697E', 'text-anchor="middle"');

const cabecera = (titulo: string, sub: string) =>
  `<rect width="${W}" height="${H}" fill="#fff"/>` +
  `<rect x="0" y="0" width="${W}" height="8" fill="#0077B6"/>` +
  `<circle cx="72" cy="64" r="18" fill="none" stroke="#00A0DF" stroke-width="2.5"/><path d="M60 64h4.4l3.2-7 4.8 14 3.6-7H84" fill="none" stroke="#00A0DF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` +
  t(102, 60, 'PAUSA', 20, 700, '#003B5C', 'letter-spacing="3"') +
  t(102, 80, 'Red médica de Pacífico Seguros · Lima, Perú', 12, 400, '#3F697E') +
  t(W - 56, 60, titulo, 14, 700, '#003B5C', 'text-anchor="end"') +
  t(W - 56, 80, sub, 12, 400, '#3F697E', 'text-anchor="end"') +
  line(104);

export function numeroCert(s: AppState) {
  const y = (s.evaluacion?.inicio ?? new Date()).getFullYear();
  return `PAU-${y}-004812`;
}

export function certSVG(s: AppState): string {
  const ev = s.evaluacion; if (!ev) return '';
  const m = byId(MED, ev.medicoId);
  const consulta = fechaSlot(m.slots[s.medSlot]);
  const emision = consulta;
  const previos = s.presenter.diasPrevios;
  const acumulados = previos + ev.dias;
  let y = 150;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecera('CERTIFICADO DE DESCANSO MÉDICO', `N.º ${numeroCert(s)} · Emitido el ${fmtCompleto(emision)}`);
  svg += t(56, y, 'Certificado de descanso médico', 24, 700); y += 24;
  svg += t(56, y, `Emitido tras teleconsulta por videollamada realizada el ${fmtCompleto(consulta)} a las ${horaDe(consulta)}.`, 13, 400, '#3F697E'); y += 40;

  svg += lab(56, y, 'Nombres y apellidos'); svg += t(56, y + 26, PERSONA.nombreCompleto, 18, 700);
  svg += lab(430, y, 'Edad'); svg += t(430, y + 26, `${PERSONA.edad} años`, 18, 700);
  svg += lab(560, y, 'DNI'); svg += t(560, y + 26, PERSONA.dni, 18, 700);
  y += 56; svg += line(y); y += 34;

  svg += lab(56, y, 'Diagnóstico (CIE-10)'); svg += t(56, y + 28, `${CIE10.codigo}  ${CIE10.titulo}`, 20, 700);
  svg += lab(430, y, 'Fecha de atención'); svg += t(430, y + 28, `${fmtNumerico(consulta)} · ${horaDe(consulta)}`, 16, 600);
  y += 60; svg += line(y); y += 34;

  svg += lab(56, y, 'Período de descanso');
  svg += `<rect x="56" y="${y + 14}" width="${W - 112}" height="126" rx="12" fill="#FDF3E3"/>`;
  svg += `<text x="80" y="${y + 52}" ${FONT} font-size="16" fill="#003B5C">Se indica descanso médico por <tspan font-weight="700">${enLetras(ev.dias)} (${ev.dias}) días calendario</tspan>,</text>`;
  svg += `<text x="80" y="${y + 80}" ${FONT} font-size="16" fill="#003B5C">del <tspan font-weight="700">${fmtCompleto(ev.inicio)}</tspan> al <tspan font-weight="700">${fmtCompleto(ev.fin)}</tspan>.</text>`;
  svg += `<text x="80" y="${y + 108}" ${FONT} font-size="16" fill="#003B5C">Reincorporación: <tspan font-weight="700">${fmtCompleto(ev.reincorporacion)}</tspan>. Fecha de emisión: ${fmtNumerico(emision)}.</text>`;
  y += 172;
  svg += lab(56, y, 'Indicaciones'); svg += t(56, y + 24, 'Desconexión laboral completa durante el período indicado y control al reincorporarse.', 14); y += 52;
  svg += lab(56, y, 'Días de descanso acumulados en el año'); svg += t(56, y + 24, `${acumulados} de ${LIMITE_DIAS_ANIO} justificables con certificado particular${acumulados > LIMITE_DIAS_ANIO ? ' · supera el límite: requiere validación de EsSalud y canje por CITT en 30 días hábiles' : ''}`, 14, acumulados > LIMITE_DIAS_ANIO ? 700 : 400, acumulados > LIMITE_DIAS_ANIO ? '#B23A17' : '#003B5C');
  y += 44; svg += line(y); y += 34;

  svg += lab(56, y, 'Médico tratante'); svg += t(56, y + 28, m.nombre, 18, 700); svg += t(56, y + 52, `${m.rol} · ${m.cmp}`, 14, 400, '#3F697E');
  svg += t(56, y + 76, 'Colegiatura verificada en el registro público del Colegio Médico del Perú (simulación).', 12, 400, '#3F697E');
  // Firma y sello (placeholders, sin imitar formatos oficiales)
  const fy = y + 104;
  svg += `<line x1="56" y1="${fy + 80}" x2="330" y2="${fy + 80}" stroke="#003B5C"/>`;
  svg += t(56, fy + 100, `Firma · ${m.nombre}`, 12, 400, '#3F697E');
  svg += t(56, fy + 118, m.cmp ?? '', 12, 400, '#3F697E');
  svg += `<circle cx="470" cy="${fy + 58}" r="54" fill="none" stroke="#B23A17" stroke-width="2" stroke-dasharray="4 4" opacity=".7"/>`;
  svg += t(470, fy + 52, 'SELLO', 12, 700, '#B23A17', 'text-anchor="middle" opacity=".8"');
  svg += t(470, fy + 70, 'CASO FICTICIO', 11, 600, '#B23A17', 'text-anchor="middle" opacity=".8"');
  svg += `<rect x="600" y="${fy}" width="138" height="118" rx="12" fill="#FDF3E3"/>`;
  svg += t(669, fy + 46, 'Verificación', 11, 600, '#3F697E', 'text-anchor="middle"');
  svg += t(669, fy + 66, numeroCert(s), 12, 700, '#003B5C', 'text-anchor="middle"');
  svg += t(669, fy + 86, 'pausa.pe/verificar', 11, 400, '#3F697E', 'text-anchor="middle"');
  svg += marcaDeAgua();
  svg += pie('PAUSA es una propuesta para la hackathon de Pacífico Seguros · 2026');
  return svg + '</svg>';
}

export function avisoSVG(s: AppState): string {
  const ev = s.evaluacion; if (!ev) return '';
  const jefe = s.jefeNombre.trim() || 'Estimado/a jefe/a';
  const p = (y: number, txt: string, w = 400) => t(72, y, txt, 15, w);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecera('AVISO DE AUSENCIA POR DESCANSO MÉDICO', `Lima, ${fmtCompleto(ev.inicio)}`);
  svg += t(72, 160, PERSONA.nombreCompleto, 24, 700); svg += t(72, 184, PERSONA.cargo, 14, 400, '#3F697E');
  svg += p(240, `Para: ${jefe}`, 600);
  svg += p(286, `Le comunico que, por indicación médica, estaré de descanso durante ${enLetras(ev.dias)} (${ev.dias}) días calendario,`);
  svg += p(312, `del ${fmtCompleto(ev.inicio)} al ${fmtCompleto(ev.fin)}.`);
  svg += p(338, `Me reincorporo el ${fmtCompleto(ev.reincorporacion)}.`);
  svg += p(384, `El certificado de descanso médico N.º ${numeroCert(s)} fue emitido en la red médica PAUSA de Pacífico Seguros`);
  svg += p(410, 'y se entrega a Recursos Humanos. Este aviso no incluye información clínica.');
  svg += p(456, 'Durante estos días no estaré disponible. Dejo mis pendientes organizados y avisados al equipo.');
  svg += p(500, 'Gracias por la comprensión.');
  svg += `<line x1="72" y1="640" x2="320" y2="640" stroke="#003B5C"/>`;
  svg += p(664, PERSONA.nombreCompleto, 600); svg += t(72, 686, PERSONA.cargo, 13, 400, '#3F697E');
  svg += marcaDeAgua();
  svg += pie('Documento generado automáticamente por PAUSA · Pacífico Seguros');
  return svg + '</svg>';
}

/** Rasteriza un SVG a PNG (2×) y devuelve un dataURL. */
export function svgAPng(svg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2;
      const ctx = c.getContext('2d'); if (!ctx) { reject(new Error('canvas')); return; }
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg')); };
    img.src = url;
  });
}

export const nombreArchivo = (k: 'cert' | 'aviso') => `${k === 'aviso' ? 'Aviso-de-ausencia' : 'Certificado-medico'}-PAUSA-${PERSONA.nombre}-${PERSONA.apellidos.split(' ')[0]}.png`;
