// QA visual: recorre el flujo completo con Playwright (Edge headless, canal msedge) y captura cada
// pantalla en 360×800 y 412×915, con y sin movimiento reducido. Salida: docs/capturas/<tamaño>-<rm>/NN-pantalla.png
// Uso: node scripts/capturas.mjs [url]   (por defecto http://127.0.0.1:5173 con ?demo=rapido)
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5173/';
const root = resolve(import.meta.dirname, '..');
const TAMANOS = [{ w: 360, h: 800 }, { w: 412, h: 915 }];
const RMS = ['no-preference', 'reduce'];
const fontScale = Number(process.env.FONT_SCALE ?? '1'); // 1.3 para probar la fuente del sistema al 130 %
const soloUno = process.env.SOLO === '1';

const b = await chromium.launch({ channel: 'msedge', headless: true });
const informe = [];

for (const t of soloUno ? [TAMANOS[0]] : TAMANOS) {
  for (const rm of soloUno ? [RMS[0]] : RMS) {
    const carpeta = resolve(root, `docs/capturas/${t.w}x${t.h}-${rm === 'reduce' ? 'rm' : 'motion'}${fontScale !== 1 ? '-fs' + fontScale : ''}`);
    mkdirSync(carpeta, { recursive: true });
    const ctx = await b.newContext({ viewport: { width: t.w, height: t.h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: rm, locale: 'es-PE' });
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', (e) => errores.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    if (fontScale !== 1) await p.addInitScript((fs) => { const ap = () => { if (document.documentElement) document.documentElement.style.fontSize = `${16 * fs}px`; }; ap(); document.addEventListener('DOMContentLoaded', ap); }, fontScale);
    let n = 0;
    const shot = async (nombre) => {
      n += 1;
      await p.waitForTimeout(450);
      const overflowX = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      const recorte = await p.evaluate(() => {
        // Elementos de texto que se salen de la pantalla por la derecha o cuyo texto se recorta
        const out = [];
        for (const el of document.querySelectorAll('.screen__scroll *')) {
          const r = el.getBoundingClientRect(); if (r.width === 0) continue;
          if (r.right > innerWidth + 1) out.push(el.className || el.tagName);
        }
        return out.slice(0, 5);
      });
      await p.screenshot({ path: resolve(carpeta, `${String(n).padStart(2, '0')}-${nombre}.png`) });
      informe.push({ tam: `${t.w}x${t.h}`, rm, nombre, overflowX, recorte });
    };
    const click = async (nombre, exact = false) => { await p.getByRole('button', { name: nombre, exact }).first().click(); };
    const esperaLoader = async () => { await p.waitForTimeout(10500); };
    const tab = async (nombre) => { await p.locator('.tabbar').getByRole('button', { name: nombre }).click(); };

    await p.goto(base + '?demo=rapido', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await shot('login');
    await click('Ingresar'); await shot('reloj');
    await click('Conectar'); await p.waitForTimeout(2300); await shot('inicio');
    await p.waitForTimeout(3200); await shot('inicio-alerta');
    await click('Ahora no');
    await tab('Citas'); await shot('citas-vacio');
    await tab('Documentos'); await shot('documentos-vacio');
    await tab('Perfil'); await shot('perfil');
    await tab('Inicio');
    await click('Pedir ayuda'); await shot('ayuda');
    // Psicología
    await p.getByText('Quiero hablar con alguien').click(); await shot('psico-lista');
    await p.getByRole('button', { name: /Lic\. Andrea Torres/ }).click(); await p.getByRole('radio').first().click(); await shot('psico-horario');
    await click('Confirmar sesión'); await shot('psico-ok');
    await click('Ir al inicio'); await click('Pedir ayuda');
    // Medicina
    await p.getByText('Necesito parar unos días').click(); await p.waitForTimeout(1800); await shot('buscando-inhala');
    await p.waitForTimeout(4000); await shot('buscando-exhala');
    await p.waitForTimeout(5000); await shot('medico');
    await click('Ver otros médicos disponibles'); await shot('medico-otros');
    await click('Ocultar otros médicos');
    await click('Confirmar cita'); await shot('pre-intro');
    await click('Empezar'); await shot('pre-1');
    for (let i = 0; i < 4; i++) { await p.getByRole('radio', { name: i < 2 ? 'Casi todos los días' : 'Varios días' }).click(); await p.waitForTimeout(350); }
    await shot('pre-resultado');
    await click('Continuar'); await shot('cita-confirmada');
    await click('Simular que llegó la hora de tu cita'); await p.waitForTimeout(2500); await shot('sala-espera');
    await esperaLoader(); await shot('sala-lista');
    await p.getByRole('button', { name: /Entrar/ }).click(); await p.waitForTimeout(1200); await shot('teleconsulta');
    await p.waitForTimeout(4200); await click('Finalizar consulta'); await shot('teleconsulta-fin');
    await click('Sí, terminar'); await p.waitForTimeout(3200); await shot('evaluacion');
    await click('Tengo una duda sobre mi indicación'); await shot('evaluacion-duda'); await click('Cancelar');
    await click('Ver mi certificado'); await p.waitForTimeout(1800); await shot('emitiendo');
    await esperaLoader(); await shot('certificado');
    await click('Vista previa del certificado'); await p.waitForTimeout(600); await shot('certificado-visor'); await click('Cerrar');
    await click('Iniciar el trámite'); await p.waitForTimeout(2000); await shot('tramite');
    await p.waitForTimeout(4000); await shot('tramite-listo');
    await click('Ver mi proceso'); await shot('proceso');
    await click('Avisar a tu empleador'); await shot('empleador-jefe');
    await p.getByRole('radio', { name: /Recursos Humanos/ }).click(); await shot('empleador-rrhh');
    await p.getByRole('checkbox').click(); await click('Continuar'); await shot('correo');
    await p.getByRole('button', { name: 'Atrás' }).last().click(); await p.waitForTimeout(500); await p.getByRole('button', { name: 'Atrás' }).last().click(); await p.waitForTimeout(500);
    await click('Volver al inicio'); await p.waitForTimeout(1500); await shot('inicio-en-pausa');
    await tab('Documentos'); await shot('documentos');
    await tab('Citas'); await shot('citas');
    informe.push({ tam: `${t.w}x${t.h}`, rm, errores });
    await ctx.close();
    console.log(`listo ${t.w}x${t.h} ${rm} · errores: ${errores.length}`);
  }
}
await b.close();
writeFileSync(resolve(root, `docs/capturas/informe${fontScale !== 1 ? '-fs' + fontScale : ''}.json`), JSON.stringify(informe, null, 2));
const problemas = informe.filter((x) => x.overflowX || (x.recorte && x.recorte.length) || (x.errores && x.errores.length));
console.log(problemas.length ? 'PROBLEMAS:\n' + JSON.stringify(problemas, null, 1) : 'sin desbordes ni errores');
