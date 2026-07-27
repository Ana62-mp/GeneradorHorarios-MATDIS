export const REQUIRED_MODALITIES = [
  "CUALQUIERA",
  "PRESENCIAL",
  "VIRTUAL",
] as const;

export type RequiredModalityValue = (typeof REQUIRED_MODALITIES)[number];

export interface ScheduleConfigurationInput {
  numberOfCourses: number;
  maximumCredits: number;
  maximumDifficultCourses: number;
  requiredCourseIds: number[];
  completedCourseIds: number[];
  requiredModality: RequiredModalityValue;
  avoidTimeConflicts: boolean;
  validatePrerequisites: boolean;
}

export interface GeneratorCourse {
  id: number;
  name: string;
  section: string | null;
  day: string;
  startTime: Date;
  endTime: Date;
  modality: string;
  difficulty: string;
  credits: number;
  prerequisiteIds: number[];
}

export interface SchedulePropositions {
  correctSize: boolean;
  includesRequiredCourses: boolean;
  hasNoTimeConflicts: boolean;
  meetsModality: boolean;
  meetsDifficultyLimit: boolean;
  meetsCreditLimit: boolean;
  meetsPrerequisites: boolean;
}

export const REJECTION_CODES = [
  "CANTIDAD_INCORRECTA",
  "MATERIAS_OBLIGATORIAS_FALTANTES",
  "CRUCE_HORARIO",
  "MODALIDAD_NO_CUMPLIDA",
  "MAXIMO_DIFICILES_SUPERADO",
  "MAXIMO_CREDITOS_SUPERADO",
  "PRERREQUISITOS_NO_CUMPLIDOS",
] as const;

export type RejectionCodeValue =
  (typeof REJECTION_CODES)[number];

export interface ScheduleRejectionReason {
  code: RejectionCodeValue;
  message: string;
}