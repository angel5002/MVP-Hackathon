import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';
import { esNativo } from './platform/native';

// Service worker solo en web/PWA: dentro del APK los archivos ya son locales y la caché precargada
// retrasaría cada actualización de la app.
if (!esNativo() && 'serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => { /* sin SW */ });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
