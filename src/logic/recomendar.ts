import type { Profesional } from '../types';

/**
 * Sistema único de recomendación de profesionales de la red (psicólogos y médicos).
 * Puntúa por historial (ya te atendió), disponibilidad (hoy / más pronto) y cercanía, con la
 * valoración como desempate. Con psicólogos ordena la lista y marca la primera opción; con médicos
 * asigna directamente al mejor puntuado: el asegurado no elige, para evitar el fraude de buscar a
 * quien firme el descanso.
 */
const PESOS: [RegExp, number][] = [
  [/te atendió antes/i, 3],
  [/disponible (hoy|más pronto)/i, 2],
  [/más cercan/i, 2],
  [/presencial/i, 0.5],
];

export function puntuar(p: Profesional): number {
  const porTags = p.tags.reduce((s, [, t]) => s + (PESOS.find(([r]) => r.test(t))?.[1] ?? 0), 0);
  const rating = p.rating ? parseFloat(p.rating.replace(',', '.')) / 10 : 0;
  return porTags + rating;
}

export const ordenar = (lista: Profesional[]) => [...lista].sort((a, b) => puntuar(b) - puntuar(a));
export const recomendado = (lista: Profesional[]) => ordenar(lista)[0];

/** Motivo corto de la recomendación, para mostrar junto al profesional. */
export function motivo(p: Profesional): string {
  const t = p.tags.map(([, x]) => x.toLowerCase());
  if (t.some((x) => x.includes('te atendió antes'))) return 'porque ya te atendió';
  if (t.some((x) => x.startsWith('disponible'))) return 'por disponibilidad';
  if (t.some((x) => x.includes('más cercan'))) return 'por cercanía';
  return 'por su valoración';
}
