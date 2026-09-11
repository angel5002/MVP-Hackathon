// Compila el APK de depuración con el JDK 21 inyectado solo en este proceso (no toca JAVA_HOME global)
// y lo copia a entregables/PAUSA-debug.apk. Uso: node scripts/build-apk.mjs [--release-check]
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const JDK = process.env.PAUSA_JDK ?? 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.11.10-hotspot';
const SDK = process.env.ANDROID_HOME ?? `${process.env.LOCALAPPDATA}\\Android\\Sdk`;
if (!existsSync(JDK)) { console.error('No se encontró el JDK 21 en', JDK); process.exit(1); }
if (!existsSync(SDK)) { console.error('No se encontró el Android SDK en', SDK); process.exit(1); }

// local.properties: Gradle lo exige aunque ANDROID_HOME exista
writeFileSync(resolve(root, 'android/local.properties'), `sdk.dir=${SDK.replace(/\\/g, '\\\\')}\n`);

const env = { ...process.env, JAVA_HOME: JDK, ANDROID_HOME: SDK, ANDROID_SDK_ROOT: SDK, PATH: `${JDK}\\bin;${process.env.PATH}` };
const run = (cmd, args, cwd) => {
  console.log('>', cmd, args.join(' '));
  const r = spawnSync(cmd, args, { cwd, env, stdio: 'inherit', shell: true });
  if (r.status !== 0) { console.error(`Falló: ${cmd} (código ${r.status})`); process.exit(r.status ?? 1); }
};

run('npx', ['vite', 'build'], root);
run('npx', ['cap', 'sync', 'android'], root);
run(`"${resolve(root, 'android/gradlew.bat')}"`, ['assembleDebug', '--no-daemon', '--console=plain'], resolve(root, 'android'));

const apk = resolve(root, 'android/app/build/outputs/apk/debug/app-debug.apk');
mkdirSync(resolve(root, 'entregables'), { recursive: true });
copyFileSync(apk, resolve(root, 'entregables/PAUSA-debug.apk'));
const mb = (statSync(apk).size / 1024 / 1024).toFixed(2);
console.log(`\nAPK listo: entregables/PAUSA-debug.apk (${mb} MB)`);
