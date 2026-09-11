import type { PatronLaboral, Profesional } from '../types';

/** Todos los datos son ficticios. Profesionales y colegiaturas no existen. */

export const PERSONA = {
  nombre: 'Camila',
  apellidos: 'Reyes Fernández',
  nombreCompleto: 'Camila Reyes Fernández',
  iniciales: 'CR',
  edad: 24,
  dni: '72 345 618',
  cargo: 'Analista junior',
  empresa: 'Grupo Andino S.A.C.',
  plan: 'PAUSA Standard',
  planDesde: 'abril de 2026',
  sesionesAnuales: 6,
  primaMensual: 'S/ 7,30',
};

export const PATRON: PatronLaboral = { diasSinDesconectar: 11, nochesTarde: 4, horasSemana: 62 };
export const RELOJ = { suenoPromedioHoras: 5.2, ritmo: 'irregular' as const };

/** Horas conectada por día (L..D) y si hubo actividad después de las 11 pm. */
export const SEMANA = [
  { h: 11.5, late: true }, { h: 10.4, late: false }, { h: 12.2, late: true }, { h: 9.4, late: false },
  { h: 11.5, late: true }, { h: 7.5, late: true }, { h: 5.5, late: false },
];

export const PSICO: Profesional[] = [
  { id: 'at', ini: 'AT', nombre: 'Lic. Andrea Torres', rol: 'Psicóloga clínica, 6 años', rating: '4,9', color: 'blue',
    tags: [['ok', 'Te atendió antes'], ['info', 'Disponible hoy']], nota: 'Última sesión hace 3 semanas',
    slots: [{ offsetDias: 0, hora: '18:00' }, { offsetDias: 1, hora: '19:30' }, { offsetDias: 2, hora: '17:00' }] },
  { id: 'ms', ini: 'MS', nombre: 'Lic. Marco Salazar', rol: 'Psicólogo laboral, 9 años', rating: '4,8', color: 'navy',
    tags: [['warn', 'Más cercano, 1,2 km'], ['line', 'Presencial']], nota: 'San Isidro, atiende hasta las 9 pm',
    slots: [{ offsetDias: 0, hora: '20:00' }, { offsetDias: 2, hora: '19:00' }, { offsetDias: 4, hora: '10:00' }] },
  { id: 'pr', ini: 'PR', nombre: 'Lic. Paola Ríos', rol: 'Psicóloga, 4 años', rating: '4,7', color: 'green',
    tags: [['line', 'Turnos de noche']], nota: 'Especialista en descanso y sueño',
    slots: [{ offsetDias: 0, hora: '21:30' }, { offsetDias: 1, hora: '22:00' }] },
  { id: 'dh', ini: 'DH', nombre: 'Lic. Diego Huamán', rol: 'Psicólogo, 7 años', rating: '4,9', color: 'orange',
    tags: [['line', 'Fines de semana']], nota: 'Atiende sábados y domingos',
    slots: [{ offsetDias: 5, hora: '09:00' }, { offsetDias: 6, hora: '11:00' }] },
];

export const MED: Profesional[] = [
  { id: 'eq', ini: 'EQ', nombre: 'Dra. Elena Quispe Vargas', rol: 'Medicina general', cmp: 'CMP 042817', color: 'orange',
    tags: [['ok', 'Disponible más pronto'], ['info', 'Te atendió antes']],
    slots: [{ offsetDias: 0, hora: '16:30' }, { offsetDias: 0, hora: '18:00' }, { offsetDias: 1, hora: '09:00' }] },
  { id: 'lp', ini: 'LP', nombre: 'Dr. Luis Paredes', rol: 'Medicina general', cmp: 'CMP 051233', color: 'navy',
    tags: [['warn', 'Más cercano, 0,8 km'], ['line', 'Presencial']],
    slots: [{ offsetDias: 1, hora: '08:00' }, { offsetDias: 1, hora: '17:00' }] },
  { id: 'rm', ini: 'RM', nombre: 'Dra. Rocío Mendoza', rol: 'Medicina ocupacional', cmp: 'CMP 038790', color: 'green',
    tags: [['line', 'Turno noche']],
    slots: [{ offsetDias: 0, hora: '20:00' }, { offsetDias: 1, hora: '20:00' }] },
];

export const CIE10 = { codigo: 'F43.2', titulo: 'Trastornos de adaptación' };
export const LINEA_MINSA = { numero: '113', opcion: '5', tel: 'tel:113', texto: 'Línea 113, opción 5' };
export const LIMITE_DIAS_ANIO = 20;

export const byId = (lista: Profesional[], id: string) => lista.find((p) => p.id === id) ?? lista[0];
