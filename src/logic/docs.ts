import QRCode from 'qrcode';
import { CIE10, LIMITE_DIAS_ANIO, MED, PERSONA, RELOJ, byId } from '../data/red';
import type { AppState } from '../types';
import { enLetras, fmtCompleto, fmtNumerico, horaDe, fechaSlot } from './fechas';

/**
 * Documentos generados como SVG propio, siguiendo la maqueta entregada por el equipo (cabecera con las dos marcas,
 * banda de título, dos columnas de datos, diagnóstico CIE-10, certificación del descanso, indicaciones,
 * observaciones y QR de validación). Sin firma ni sello: la validación es por QR. Maquetación propia,
 * sin logos ni estructura del CMP o del CITT.
 */
const W = 794, H_CERT = 800, H_AVISO = 720;
const AZUL = '#0077B6', NAVY = '#003B5C', TINTA = '#16181C', GRIS = '#5F646B', LINEA = '#D9E2EA';
const FONT = 'font-family="DM Sans, Segoe UI, Roboto, Arial, sans-serif"';
const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (x: number, y: number, txt: string, size = 13, weight = 400, fill = TINTA, extra = '') =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(txt)}</text>`;
const mayus = (s: string) => s.toLocaleUpperCase('es-PE');

export function numeroCert(s: AppState) {
  const y = (s.evaluacion?.inicio ?? new Date()).getFullYear();
  return `PAU-${y}-004812`;
}

/** QR real (biblioteca `qrcode`, MIT) como grupo de rectángulos SVG. */
function qrSVG(texto: string, x: number, y: number, size: number) {
  const qr = QRCode.create(texto, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size, c = size / n;
  let out = `<rect x="${x - 6}" y="${y - 6}" width="${size + 12}" height="${size + 12}" fill="#fff" stroke="${LINEA}"/>`;
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.modules.get(r, k)) out += `<rect x="${(x + k * c).toFixed(2)}" y="${(y + r * c).toFixed(2)}" width="${(c + 0.15).toFixed(2)}" height="${(c + 0.15).toFixed(2)}" fill="${TINTA}"/>`;
  return out;
}

/** Cabecera común: marca de Pacífico (tipográfica) a la izquierda, PAUSA a la derecha, banda de título. */
function cabecera(H: number, titulo: string) {
  return `<rect width="${W}" height="${H}" fill="#fff"/>` +
    `<rect x="0" y="0" width="${W}" height="6" fill="${AZUL}"/>` +
    // Pacífico Seguros (texto, sin usar el logotipo oficial)
    `<path d="M62 58 c8 -14 20 -14 28 0 c8 14 20 14 28 0" fill="none" stroke="${AZUL}" stroke-width="4" stroke-linecap="round"/>` +
    t(128, 56, 'Pacífico', 26, 700, NAVY) + t(128, 76, 'Seguros', 14, 500, AZUL) +
    `<line x1="${W / 2}" y1="34" x2="${W / 2}" y2="84" stroke="${LINEA}"/>` +
    // PAUSA
    `<circle cx="${W / 2 + 60}" cy="59" r="15" fill="none" stroke="${AZUL}" stroke-width="2.6"/>` +
    `<path d="M${W / 2 + 50} 59h3.6l2.6 -5.8 4 11.6 3 -5.8h6" fill="none" stroke="${AZUL}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
    t(W / 2 + 86, 68, 'PAUSA', 26, 700, NAVY, 'letter-spacing="3"') +
    `<rect x="0" y="96" width="${W}" height="34" fill="${NAVY}"/>` +
    t(W / 2, 119, titulo, 15, 700, '#fff', 'text-anchor="middle" letter-spacing="1.2"');
}
const seccion = (x: number, y: number, txt: string, w: number) =>
  t(x, y, txt, 12, 700, NAVY) + `<line x1="${x}" y1="${y + 8}" x2="${x + w}" y2="${y + 8}" stroke="${AZUL}" stroke-width="1.5"/>`;
const par = (x: number, y: number, k: string, v: string, wk = 118) => t(x, y, k, 11, 500, GRIS) + t(x + wk, y, mayus(v), 11, 700, TINTA);
const marcaDeAgua = (H: number) =>
  t(W / 2, H / 2 + 40, 'CASO FICTICIO · PROTOTIPO SIN VALIDEZ LEGAL', 26, 700, '#B23A17', `text-anchor="middle" opacity=".09" transform="rotate(-22 ${W / 2} ${H / 2 + 40})"`);
const pie = (H: number, txt: string) =>
  `<rect x="0" y="${H - 46}" width="${W}" height="46" fill="#F5F5F2"/>` +
  t(W / 2, H - 27, 'PROTOTIPO DE DEMOSTRACIÓN · Datos, profesionales y colegiaturas son ficticios · Sin validez legal', 10, 600, '#B23A17', 'text-anchor="middle"') +
  t(W / 2, H - 12, txt, 9.5, 400, GRIS, 'text-anchor="middle"');

export function certSVG(s: AppState): string {
  const ev = s.evaluacion; if (!ev) return '';
  const m = byId(MED, ev.medicoId);
  const consulta = fechaSlot(m.slots[s.medSlot]);
  const previos = s.presenter.diasPrevios, acumulados = previos + ev.dias;
  const num = numeroCert(s);
  const colIzq = 56, colDer = 420, anchoCol = 318;
  const H = H_CERT;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecera(H, 'CERTIFICADO MÉDICO DE DESCANSO LABORAL');
  svg += t(W - 56, 150, `N.º ${num}`, 11, 600, GRIS, 'text-anchor="end"');

  // Bloque 1: asegurado y consulta
  let y = 170;
  svg += seccion(colIzq, y, 'Datos del Asegurado:', anchoCol) + seccion(colDer, y, 'Datos de la Consulta:', anchoCol);
  const filas = [
    [['Nombre:', PERSONA.nombreCompleto], ['Fecha de Emisión:', fmtCompleto(consulta)]],
    [['DNI:', PERSONA.dni.replace(/\s/g, '')], ['Médico Tratante:', m.nombre]],
    [['Edad:', `${PERSONA.edad} años`], ['CMP:', (m.cmp ?? '').replace('CMP ', '')]],
    [['Ocupación:', PERSONA.cargo], ['Especialidad:', m.rol]],
    [['Empresa:', PERSONA.empresa], ['Modalidad:', 'Teleconsulta (Red PAUSA)']],
  ];
  filas.forEach((f, i) => { const yy = y + 34 + i * 20; svg += par(colIzq, yy, f[0][0], f[0][1], 92) + par(colDer, yy, f[1][0], f[1][1], 118); });

  // Bloque 2: diagnóstico y certificación
  y = 318;
  svg += seccion(colIzq, y, 'Diagnóstico Médico (con codificación CIE-10):', anchoCol) + seccion(colDer, y, 'Certificación de Descanso:', anchoCol);
  svg += t(colIzq, y + 34, 'Código Principal (CIE-10):', 11, 500, GRIS) + t(colIzq + 160, y + 34, 'Descripción Diagnóstica:', 11, 500, GRIS);
  svg += t(colIzq, y + 54, CIE10.codigo, 13, 700, TINTA);
  svg += t(colIzq + 160, y + 54, mayus(CIE10.titulo), 11, 700, TINTA) + t(colIzq + 160, y + 70, '(Reacción a estresores identificables)', 10.5, 500, GRIS);
  const secundarios: [string, string][] = [];
  if (s.watch && RELOJ.suenoPromedioHoras < 6) secundarios.push(['F51.0', 'Insomnio no orgánico']);
  svg += t(colIzq, y + 100, 'Códigos Secundarios (si aplica):', 11, 500, GRIS);
  if (secundarios.length) secundarios.forEach(([c, d], i) => { svg += t(colIzq, y + 120 + i * 16, c, 11, 700, TINTA) + t(colIzq + 48, y + 120 + i * 16, '|  ' + mayus(d), 11, 700, TINTA); });
  else svg += t(colIzq, y + 120, 'Ninguno', 11, 600, TINTA);

  svg += t(colDer, y + 34, 'EL SUSCRITO CERTIFICA QUE EL ASEGURADO REQUIERE DESCANSO', 10.5, 600, TINTA) + t(colDer, y + 48, 'MÉDICO.', 10.5, 600, TINTA);
  svg += t(colDer, y + 74, 'Periodo de Descanso:', 11, 500, GRIS);
  svg += t(colDer, y + 92, 'DESDE:', 11, 600, TINTA) + t(colDer + 58, y + 92, mayus(fmtCompleto(ev.inicio)), 11, 700, TINTA);
  svg += t(colDer, y + 108, 'HASTA:', 11, 600, TINTA) + t(colDer + 58, y + 108, mayus(fmtCompleto(ev.fin)), 11, 700, TINTA);
  svg += t(colDer, y + 132, 'Total de Días:', 11, 500, GRIS) + t(colDer + 84, y + 132, `${mayus(enLetras(ev.dias))} (${ev.dias}) DÍAS CALENDARIO.`, 11, 700, TINTA);
  svg += t(colDer, y + 158, 'Reincorporación:', 11, 500, GRIS) + t(colDer + 100, y + 158, mayus(fmtCompleto(ev.reincorporacion)), 11, 700, TINTA);
  svg += t(colDer, y + 184, 'Indicaciones:', 11, 500, GRIS);
  svg += t(colDer, y + 200, 'REPOSO RELATIVO, EVITAR SITUACIONES DE ESTRÉS LABORAL.', 10.5, 700, TINTA) + t(colDer, y + 215, 'CUMPLIR CON PROGRAMA DE ACOMPAÑAMIENTO PAUSA.', 10.5, 700, TINTA);
  svg += `<line x1="56" y1="${y + 240}" x2="${W - 56}" y2="${y + 240}" stroke="${LINEA}"/>`;

  // Bloque 3: observaciones (izquierda) y QR de validación (derecha)
  y = 592;
  svg += `<line x1="56" y1="${y - 14}" x2="${W - 56}" y2="${y - 14}" stroke="${LINEA}"/>`;
  svg += seccion(colIzq, y, 'Observaciones:', 450);
  const obs = [
    'Documento emitido exclusivamente para fines de descanso laboral y gestión ante el empleador,',
    'amparado por la Ley 26790. No revela detalles clínicos sensibles, solo los códigos CIE-10',
    `autorizados. Emitido tras teleconsulta por videollamada del ${fmtNumerico(consulta)} a las ${horaDe(consulta)}.`,
    'Colegiatura verificada en el registro público del CMP (simulación). Validación por código QR;',
    'no requiere firma manuscrita.',
  ];
  obs.forEach((l, i) => { svg += t(colIzq, y + 28 + i * 15, l, 10.5, 400, TINTA); });
  svg += t(colIzq, y + 112, 'Días de descanso acumulados en el año:', 10.5, 500, GRIS);
  svg += t(colIzq + 206, y + 112, `${acumulados} DE ${LIMITE_DIAS_ANIO}`, 10.5, 700, acumulados > LIMITE_DIAS_ANIO ? '#B23A17' : TINTA);
  svg += t(colIzq, y + 127, acumulados > LIMITE_DIAS_ANIO ? 'Supera el límite anual con certificado particular: requiere validación de EsSalud y canje por CITT en 30 días hábiles.' : 'Los primeros 20 días del año se justifican con certificado particular; después corresponde el canje por CITT.', 9.5, 400, GRIS);
  svg += seccion(560, y, 'Código QR de Validación:', 178);
  svg += qrSVG(`https://pausa.pe/verificar/${num}`, 604, y + 24, 92);
  svg += t(650, y + 134, 'VALIDAR EN PAUSA.PE/VERIFICAR', 8, 700, GRIS, 'text-anchor="middle"');
  svg += t(650, y + 146, num, 8, 500, GRIS, 'text-anchor="middle"');

  svg += marcaDeAgua(H);
  svg += pie(H, 'PAUSA es una propuesta para la hackathon de Pacífico Seguros · 2026');
  return svg + '</svg>';
}

export function avisoSVG(s: AppState): string {
  const ev = s.evaluacion; if (!ev) return '';
  const jefe = s.jefeNombre.trim() || 'Estimado/a jefe/a';
  const num = numeroCert(s);
  const p = (y: number, txt: string, w = 400) => t(72, y, txt, 13, w, TINTA);
  const H = H_AVISO;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecera(H, 'AVISO DE AUSENCIA POR DESCANSO MÉDICO');
  svg += t(W - 56, 150, `Lima, ${fmtCompleto(ev.inicio)}`, 11, 600, GRIS, 'text-anchor="end"');
  svg += t(72, 190, PERSONA.nombreCompleto, 20, 700, NAVY); svg += t(72, 210, `${PERSONA.cargo} · ${PERSONA.empresa}`, 12, 500, GRIS);
  svg += p(256, `Para: ${jefe}`, 700);
  svg += p(292, `Le comunico que, por indicación médica, estaré de descanso durante ${enLetras(ev.dias)} (${ev.dias}) días calendario,`);
  svg += p(312, `del ${fmtCompleto(ev.inicio)} al ${fmtCompleto(ev.fin)}. Me reincorporo el ${fmtCompleto(ev.reincorporacion)}.`);
  svg += p(348, `El certificado médico N.º ${num} fue emitido en la red médica PAUSA de Pacífico Seguros y se entrega a`);
  svg += p(368, 'Recursos Humanos. Este aviso no incluye información clínica.');
  svg += p(404, 'Durante estos días no estaré disponible. Dejo mis pendientes organizados y avisados al equipo.');
  svg += p(440, 'Gracias por la comprensión.');
  svg += `<line x1="72" y1="540" x2="320" y2="540" stroke="${LINEA}"/>`;
  svg += p(562, PERSONA.nombreCompleto, 700); svg += t(72, 580, PERSONA.cargo, 11, 400, GRIS);
  svg += seccion(540, 500, 'Validación:', 198);
  svg += qrSVG(`https://pausa.pe/verificar/${num}`, 590, 522, 96);
  svg += t(638, 640, `AVISO VINCULADO AL CERTIFICADO ${num}`, 8, 500, GRIS, 'text-anchor="middle"');
  svg += marcaDeAgua(H);
  svg += pie(H, 'Documento generado automáticamente por PAUSA · Pacífico Seguros');
  return svg + '</svg>';
}

/** Rasteriza un SVG a PNG (2×) y devuelve un dataURL. */
export function svgAPng(svg: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const alto = Number((svg.match(/height="(\d+)"/) ?? [])[1] ?? H_AVISO);
      const c = document.createElement('canvas'); c.width = W * 2; c.height = alto * 2;
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
