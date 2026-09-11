import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pe.pausa.hackathon',
  appName: 'PAUSA',
  webDir: 'dist',
  android: {
    // La app dibuja detrás de las barras del sistema (edge-to-edge obligatorio con target 36).
    // Los insets llegan por CSS: var(--safe-area-inset-*, env(safe-area-inset-*)).
    backgroundColor: '#F5F5F2',
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT', // íconos oscuros sobre el fondo claro; la barra de navegación se oculta en MainActivity
      hidden: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#F5F5F2',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
};

export default config;
