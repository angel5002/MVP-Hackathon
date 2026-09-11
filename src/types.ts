export type ColorKey = 'blue' | 'navy' | 'green' | 'orange';
export type ChipKind = 'info' | 'ok' | 'warn' | 'line';

/** Horario relativo a hoy, para que las fechas siempre sean coherentes con el día real. */
export interface SlotDef {
  offsetDias: number; // 0 = hoy, 1 = mañana…
  hora: string;       // 'HH:mm' en 24 h
}

export interface Profesional {
  id: string;
  ini: string;
  nombre: string;
  rol: string;
  cmp?: string;
  color: ColorKey;
  tags: [ChipKind, string][];
  nota?: string;
  rating?: string;
  slots: SlotDef[];
}

export interface Sesion {
  proId: string;
  slot: SlotDef;
}

export interface PatronLaboral {
  diasSinDesconectar: number;
  nochesTarde: number;
  horasSemana: number;
}

export interface DatosReloj {
  suenoPromedioHoras: number;
  ritmo: 'regular' | 'irregular';
}

export interface Evaluacion {
  dias: number;
  inicio: Date;
  fin: Date;
  reincorporacion: Date;
  fundamento: string;
  medicoId: string;
  detalle: string[]; // filas de la tabla de decisión aplicadas
}

export type TabId = 'home' | 'citas' | 'docs' | 'perfil';

export type ScreenId =
  | TabId
  | 'login' | 'watch'
  | 'ayuda' | 'psico' | 'psicoOk'
  | 'buscando' | 'medico'
  | 'preIntro' | 'pre' | 'preResultado'
  | 'cita' | 'sala' | 'tele'
  | 'evaluacion' | 'emitiendo' | 'cert' | 'tramite' | 'proceso'
  | 'empleador' | 'correo';

export type DocKind = 'cert' | 'aviso';
export type Destinatario = 'jefe' | 'rrhh';

export interface Presenter {
  forzarDias: number | null; // 3..7 o null
  unCiclo: boolean;          // acorta los loaders a un ciclo
  diasPrevios: number;       // días de descanso ya usados en el año (0 o 15)
}

export interface AppState {
  logged: boolean;
  watch: boolean;
  alertNever: boolean;
  alertSeen: boolean;
  haptica: boolean;
  toggles: { hours: boolean; geo: boolean };
  tab: TabId;

  psico: string | null;
  psicoSlot: number | null;
  sesiones: Sesion[];

  medId: string;
  medSlot: number;
  medOthers: boolean;
  citaConfirmada: boolean;
  preConsulta: number[] | null; // 4 respuestas 0..3
  horaLlego: boolean;           // "Simular que llegó la hora"
  consultaHecha: boolean;
  evaluacion: Evaluacion | null;
  certEmitido: boolean;
  tramiteListo: boolean;

  correoDest: Destinatario;
  jefeNombre: string;
  correoJefe: string;
  correoRrhh: string;

  presenter: Presenter;
}
