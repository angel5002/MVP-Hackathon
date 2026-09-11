// Genera PNG de marca a partir de un SVG con Edge headless (playwright-core, canal msedge).
// Salidas: public/icons/*.png (PWA) y assets/*.png (fuente para @capacitor/assets).
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const b = await chromium.launch({ channel: 'msedge', headless: true });
const marca = (fondo, escala = 1, radio = 120, trazo = '#fff') => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    ${fondo ? `<rect width="512" height="512" rx="${radio}" fill="${fondo}"/>` : ''}
    <g fill="none" stroke="${trazo}" stroke-width="${30 / escala}" stroke-linecap="round" stroke-linejoin="round" transform="translate(256 256) scale(${escala}) translate(-256 -256)">
      <circle cx="256" cy="256" r="150"/><path d="M150 256h44l30-64 52 128 36-64h50"/>
    </g>
  </svg>`;
const shot = async (svg, out, size, bg = 'transparent') => {
  const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0;background:${bg}"><img src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}" style="width:${size}px;height:${size}px;display:block"></body></html>`);
  await p.screenshot({ path: out, omitBackground: bg === 'transparent' });
  await p.close();
  console.log('ok', out);
};
mkdirSync(resolve(root, 'public/icons'), { recursive: true });
mkdirSync(resolve(root, 'assets'), { recursive: true });
const svgApp = readFileSync(resolve(root, 'public/icons/icon.svg'), 'utf8');
await shot(svgApp, resolve(root, 'public/icons/icon-192.png'), 192);
await shot(svgApp, resolve(root, 'public/icons/icon-512.png'), 512);
await shot(svgApp, resolve(root, 'public/icons/apple-touch-icon.png'), 180, '#0077B6');
// maskable: contenido dentro del 80 % central, sin esquinas redondeadas
await shot(marca('#0077B6', 0.8, 0), resolve(root, 'public/icons/icon-maskable-512.png'), 512);
// Fuentes para @capacitor/assets
await shot(marca('#0077B6', 1, 0), resolve(root, 'assets/icon-only.png'), 1024);
await shot(marca(null, 0.62, 0), resolve(root, 'assets/icon-foreground.png'), 1024);
await shot(marca('#0077B6', 0, 0, 'none'), resolve(root, 'assets/icon-background.png'), 1024);
// Splash 2732×2732: crema con la marca al centro
{
  const p = await b.newPage({ viewport: { width: 2732, height: 2732 }, deviceScaleFactor: 1 });
  const s = marca(null, 1, 0, '#0077B6');
  await p.setContent(`<html><body style="margin:0;background:#FDF3E3;display:flex;align-items:center;justify-content:center;height:100vh"><img src="data:image/svg+xml;utf8,${encodeURIComponent(s)}" style="width:560px;height:560px"></body></html>`);
  await p.screenshot({ path: resolve(root, 'assets/splash.png') });
  await p.screenshot({ path: resolve(root, 'assets/splash-dark.png') });
  await p.close(); console.log('ok splash');
}
await b.close();
