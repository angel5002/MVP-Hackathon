import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pe.pausa.hackathon',
  appName: 'PAUSA',
  webDir: 'dist',
  android: {
    // La app dibuja detrás de las barras del sistema (edge-to-edge obligatorio con target 36).
    // Los insets llegan por CSS: var(--safe-area-inset-*, env(safe-area-inset-*)).
    backgroundColor: '#FDF3E3',
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT', // barras claras: íconos oscuros sobre la crema
      hidden: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#FDF3E3',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
};

export default config;
