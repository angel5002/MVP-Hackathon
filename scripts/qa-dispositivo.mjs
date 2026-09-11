// QA en dispositivo real: conecta Playwright al WebView de la app por DevTools (adb forward → CDP),
// recorre el flujo en el teléfono, guarda capturas en docs/capturas/dispositivo/ y el logcat filtrado.
// No inyecta eventos del sistema (HyperOS lo bloquea sin "Depuración USB · ajustes de seguridad").
// Uso: node scripts/qa-dispositivo.mjs
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const ADB = process.env.ADB ?? `${process.env.LOCALAPPDATA}\\Android\\Sdk\\platform-tools\\adb.exe`;
const PKG = 'pe.pausa.hackathon';
const out = resolve(import.meta.dirname, '../docs/capturas/dispositivo');
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
const adb = (...a) => execFileSync(ADB, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sh = (cmd) => adb('shell', cmd);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const modelo = sh('getprop ro.product.model').trim(), android = sh('getprop ro.build.version.release').trim();
// La pantalla debe estar encendida y desbloqueada: sin eso el WebView no pinta y screencap devuelve negro.
const despierto = /mWakefulness=Awake/.test(sh('dumpsys power | grep mWakefulness='));
const bloqueado = /mDreamingLockscreen=true/.test(sh('dumpsys window | grep mDreamingLockscreen'));
if (!despierto || bloqueado) { console.error(`El teléfono está ${despierto ? 'bloqueado' : 'con la pantalla apagada'}. Enciéndelo y desbloquéalo; luego vuelve a correr este script.`); process.exit(2); }
sh('svc power stayon usb');
adb('logcat', '-c');
sh(`am force-stop ${PKG}`); await sleep(600);
sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1`);
await sleep(3000);
const pid = sh(`pidof ${PKG}`).trim();
if (!pid) { console.error('La app no está corriendo'); process.exit(1); }
adb('forward', 'tcp:9333', `localabstract:webview_devtools_remote_${pid}`);
const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
const ctx = b.contexts()[0];
const p = ctx.pages().find((x) => x.url().startsWith('https://localhost')) ?? ctx.pages()[0];
console.log('WebView:', p.url(), '· pid', pid, '·', modelo, 'Android', android);
const errores = [];
p.on('pageerror', (e) => errores.push(String(e)));
p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });

let n = 0; const informe = [];
const shot = async (nombre) => {
  n += 1; const f = `${String(n).padStart(2, '0')}-${nombre}.png`;
  await p.waitForTimeout(400);
  // Captura nativa de la pantalla completa (barras del sistema incluidas): page.screenshot por CDP no responde en el WebView de Android
  const png = execFileSync(ADB, ['exec-out', 'screencap', '-p'], { maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(resolve(out, f), png);
  informe.push(f); console.log('captura', f);
};
const click = async (nombre) => { await p.getByRole('button', { name: nombre }).last().click(); };
const tab = async (nombre) => { await p.locator('.tabbar').getByRole('button', { name: nombre }).click(); };

const insets = await p.evaluate(() => { const cs = getComputedStyle(document.documentElement); return { top: cs.getPropertyValue('--safe-area-inset-top').trim(), bottom: cs.getPropertyValue('--safe-area-inset-bottom').trim(), viewport: `${innerWidth}x${innerHeight}`, dpr: devicePixelRatio, nativo: !!window.Capacitor?.isNativePlatform?.() }; });
console.log('insets', JSON.stringify(insets));

await shot('ingreso');
await click('Ingresar'); await shot('reloj');
await click('Conectar'); await p.waitForTimeout(2500); await shot('inicio');
await p.waitForTimeout(3500); await shot('inicio-alerta');
await click('Agendar'); await p.waitForTimeout(500); await shot('ayuda');
await p.getByText('Necesito parar unos días').click(); await p.waitForTimeout(2000); await shot('loader-inhala');
await p.waitForTimeout(4000); await shot('loader-exhala');
await p.waitForTimeout(5000); await shot('medico');
await click('Confirmar cita'); await shot('pre-intro');
await click('Empezar'); await shot('pre-1');
for (let i = 0; i < 4; i++) { await p.getByRole('radio', { name: i < 2 ? 'Casi todos los días' : 'Varios días' }).click(); await p.waitForTimeout(400); }
await shot('pre-resultado');
await click('Continuar'); await shot('cita-confirmada');
await click('Simular que llegó la hora de tu cita'); await p.waitForTimeout(2500); await shot('sala-espera');
await p.waitForTimeout(29000); await shot('sala-lista');
await p.getByRole('button', { name: /Entrar/ }).click(); await p.waitForTimeout(1500); await shot('teleconsulta');
await p.waitForTimeout(10500); await click('Finalizar consulta'); await p.waitForTimeout(500); await shot('finalizar-sheet');
await click('Sí, terminar'); await p.waitForTimeout(3500); await shot('evaluacion');
await click('Ver mi certificado'); await p.waitForTimeout(2000); await shot('emitiendo');
await p.waitForTimeout(9500); await shot('certificado');
await click('Vista previa del certificado'); await p.waitForTimeout(700); await shot('visor'); await click('Cerrar');
await click('Iniciar el trámite'); await p.waitForTimeout(6500); await shot('tramite');
await click('Ver mi proceso'); await shot('proceso');
// Descarga nativa: debe abrir la hoja de compartir de Android (se detecta en logcat y por la actividad en primer plano)
await p.getByRole('button', { name: 'Descargar' }).first().click(); await p.waitForTimeout(3000);
const topShare = sh('dumpsys activity activities | grep -E "ResumedActivity" | head -1').trim();
console.log('tras Descargar:', topShare);
// Volver a la app si quedó la hoja de compartir encima
sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1`); await p.waitForTimeout(1500);
await click('Avisar a tu empleador'); await shot('empleador');
await p.getByRole('checkbox').click(); await click('Continuar'); await shot('correo');
// Botón atrás de la app (barra superior) y navegación de vuelta
await p.getByRole('button', { name: 'Atrás' }).last().click(); await p.waitForTimeout(600);
await p.getByRole('button', { name: 'Atrás' }).last().click(); await p.waitForTimeout(600);
await click('Volver al inicio'); await p.waitForTimeout(1500); await shot('inicio-en-pausa');
await tab('Documentos'); await shot('documentos');
await tab('Citas'); await shot('citas');
await tab('Perfil'); await shot('perfil');

const log = adb('logcat', '-d', '-v', 'time');
const filtrado = log.split('\n').filter((l) => /Capacitor|Console|chromium|AndroidRuntime.*(E\/|FATAL)|pe\.pausa|WebView|Share|Haptic/.test(l));
const logErrores = filtrado.filter((l) => /\bE\//.test(l) && /Capacitor|Console|chromium|pe\.pausa/.test(l));
writeFileSync(resolve(out, 'logcat.txt'), filtrado.join('\n'));
const resumen = { dispositivo: `${modelo} · Android ${android}`, webview: p.url(), insets, capturas: informe, erroresJs: errores, erroresLogcat: logErrores.slice(0, 30), actividadTrasDescargar: topShare };
writeFileSync(resolve(out, 'resumen.json'), JSON.stringify(resumen, null, 2));
console.log(JSON.stringify({ erroresJs: errores, erroresLogcat: logErrores.slice(0, 10), actividadTrasDescargar: topShare }, null, 1));
await b.close();
