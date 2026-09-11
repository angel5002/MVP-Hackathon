/**
 * PHQ-4 en español, derivado de las traducciones oficiales "Spanish for Peru" del GAD-7 (ítems 1 y 2)
 * y del PHQ-9 (ítems 1 y 2) publicadas en phqscreeners.com. Ver docs/fuentes/PHQ4-espanol-peru.md.
 * "No se requiere permiso para reproducir, traducir, mostrar o distribuir."
 */
export const PHQ4_ENCABEZADO = 'Durante las últimas 2 semanas, ¿con qué frecuencia ha sentido molestias por los siguientes problemas?';

export const PHQ4_ITEMS = [
  'Sentirse nervioso/a, ansioso/a, o con los nervios de punta',
  'No poder dejar de preocuparse o no poder controlar la preocupación',
  'Poco interés o placer en hacer las cosas',
  'Sentirse desanimado/a, deprimido/a o sin esperanzas',
];

export const PHQ4_OPCIONES = ['Para nada', 'Varios días', 'Más de la mitad de los días', 'Casi todos los días'];

export interface ResultadoPhq4 {
  total: number;
  ansiedad: number;  // ítems 1+2
  depresion: number; // ítems 3+4
  nivel: 'normal' | 'leve' | 'moderado' | 'grave';
  alto: boolean;     // total ≥ 9 o alguna subescala ≥ 3 con total ≥ 6
}

export function puntuarPhq4(r: number[]): ResultadoPhq4 {
  const total = r.reduce((a, b) => a + b, 0);
  const ansiedad = r[0] + r[1];
  const depresion = r[2] + r[3];
  const nivel = total >= 9 ? 'grave' : total >= 6 ? 'moderado' : total >= 3 ? 'leve' : 'normal';
  const alto = total >= 9 || (total >= 6 && (ansiedad >= 3 || depresion >= 3));
  return { total, ansiedad, depresion, nivel, alto };
}
