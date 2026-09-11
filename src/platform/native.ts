import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { AppLauncher } from '@capacitor/app-launcher';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const esNativo = () => Capacitor.isNativePlatform();
export const esStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true);

/** Modo presentación: navegador de escritorio (ni nativo ni PWA instalada) con ancho suficiente. */
export const modoPresentacion = () => !esNativo() && !esStandalone() && typeof window !== 'undefined' && window.innerWidth >= 768;

let hapticaActiva = true;
export const setHaptica = (v: boolean) => { hapticaActiva = v; };

export async function haptic(tipo: 'light' | 'medium' | 'success' = 'light') {
  if (!hapticaActiva) return;
  try {
    if (esNativo()) {
      if (tipo === 'success') await Haptics.notification({ type: NotificationType.Success });
      else await Haptics.impact({ style: tipo === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light });
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // iOS Safari no implementa vibrate: la llamada simplemente no existe y se omite sin error.
      navigator.vibrate(tipo === 'success' ? [10, 30, 10] : tipo === 'medium' ? 15 : 8);
    }
  } catch { /* la háptica nunca debe romper el flujo */ }
}

/** Abre un enlace externo o mailto: fuera del WebView. */
export async function abrirExterno(url: string) {
  if (esNativo()) {
    try { await AppLauncher.openUrl({ url }); return true; } catch { return false; }
  }
  const w = window.open(url, '_blank', 'noopener');
  if (!w) window.location.href = url;
  return true;
}

export const CARPETA_DESCARGAS = 'Documentos/PAUSA';

/**
 * Descarga un PNG (dataURL). En Android lo escribe en la carpeta pública Documentos/PAUSA
 * (accesible desde Archivos; en Android 11+ no requiere permiso para archivos propios).
 * En web dispara la descarga del navegador.
 */
export async function guardarPng(nombre: string, dataUrl: string): Promise<{ modo: 'guardado' | 'descargado'; ruta?: string }> {
  if (esNativo()) {
    const base64 = dataUrl.split(',')[1];
    const r = await Filesystem.writeFile({ path: `PAUSA/${nombre}`, data: base64, directory: Directory.Documents, recursive: true });
    return { modo: 'guardado', ruta: r.uri };
  }
  const a = document.createElement('a');
  a.href = dataUrl; a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  return { modo: 'descargado' };
}

/** Comparte un PNG por la hoja del sistema (nativo o Web Share con archivos). Devuelve false si no hay cómo. */
export async function compartirPng(nombre: string, dataUrl: string, titulo: string): Promise<boolean> {
  try {
    if (esNativo()) {
      const base64 = dataUrl.split(',')[1];
      const r = await Filesystem.writeFile({ path: nombre, data: base64, directory: Directory.Cache });
      await Share.share({ title: titulo, files: [r.uri], dialogTitle: titulo });
      return true;
    }
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], nombre, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) { await nav.share({ files: [file], title: titulo }); return true; }
    return false;
  } catch { return false; } // cancelar la hoja no es un error
}
