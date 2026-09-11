// Verificación de contraste WCAG 2.2 (1.4.3 / 1.4.11) para la paleta PAUSA.
// Uso: node scripts/contraste.mjs [--json]
// Fórmula: https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

const hex2rgb = (h) => { h = h.replace('#',''); if (h.length===3) h = h.split('').map(c=>c+c).join(''); return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)); };
const lin = (c) => { c/=255; return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const L = (hex) => { const [r,g,b] = hex2rgb(hex); return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b); };
export const ratio = (fg, bg) => { const a = L(fg), b = L(bg); const [hi,lo] = a>b?[a,b]:[b,a]; return (hi+0.05)/(lo+0.05); };
const fmt = (r) => r.toFixed(2).replace('.',',') + ':1';
// Mezcla lineal en sRGB (para tonos derivados): mix('#003B5C','#FDF3E3',0.3)
export const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return '#' + A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase(); };

// ---- Paleta base (ficha de diseño, se conserva) ----
export const BASE = { blue:'#00A0DF', navy:'#003B5C', orange:'#FF5C35', green:'#2FA84F', cream:'#FDF3E3', white:'#FFFFFF' };

// ---- Pares a verificar: [descripción, fg, bg, tipo] ; tipo: 'texto' (4.5) | 'grande' (3.0) | 'ui' (3.0)
const pares = (process.argv.includes('--legacy')) ? [
  ['LEGADO gris secundario sobre crema', '#6B7280', '#FDF3E3', 'texto'],
  ['LEGADO blanco sobre azul Pacífico (extremo del gradiente)', '#FFFFFF', '#00A0DF', 'texto'],
  ['LEGADO naranja sobre blanco', '#FF5C35', '#FFFFFF', 'texto'],
  ['LEGADO blanco sobre #0077B6 (extremo oscuro del gradiente)', '#FFFFFF', '#0077B6', 'texto'],
  ['LEGADO naranja-fg #B23A17 sobre #FFE9E1', '#B23A17', '#FFE9E1', 'texto'],
  ['LEGADO verde-fg #1E7A3A sobre #E3F5E8', '#1E7A3A', '#E3F5E8', 'texto'],
  ['LEGADO navy sobre crema', '#003B5C', '#FDF3E3', 'texto'],
  ['LEGADO texto #1F2937 sobre crema', '#1F2937', '#FDF3E3', 'texto'],
  ['LEGADO azul #00A0DF como ícono sobre blanco (UI 3:1)', '#00A0DF', '#FFFFFF', 'ui'],
  ['LEGADO azul-d #0077B6 (pestaña activa) sobre blanco', '#0077B6', '#FFFFFF', 'texto'],
] : JSON.parse(process.env.PARES || '[]');

const min = { texto:4.5, grande:3.0, ui:3.0 };
const rows = pares.map(([d,fg,bg,t]) => { const r = ratio(fg,bg); return { d, fg, bg, t, r, ok: r >= min[t] }; });
if (process.argv.includes('--json')) { console.log(JSON.stringify(rows,null,2)); }
else {
  console.log('| Par | Primer plano | Fondo | Uso | Ratio | Mínimo | Resultado |');
  console.log('|---|---|---|---|---|---|---|');
  for (const x of rows) console.log(`| ${x.d} | \`${x.fg}\` | \`${x.bg}\` | ${x.t} | ${fmt(x.r)} | ${min[x.t]}:1 | ${x.ok?'✅ pasa':'❌ falla'} |`);
}
