export const DAYS = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
] as const;

export const MODALITIES = [
  "PRESENCIAL",
  "VIRTUAL",
] as const;

export const DIFFICULTIES = [
  "BAJA",
  "MEDIA",
  "ALTA",
] as const;

export type DayValue = (typeof DAYS)[number];
export type ModalityValue = (typeof MODALITIES)[number];
export type DifficultyValue = (typeof DIFFICULTIES)[number];

export interface CourseInput {
  name: string;
  section?: string | null;
  day: DayValue;
  startTime: string;
  endTime: string;
  modality: ModalityValue;
  difficulty: DifficultyValue;
  credits: number;
  prerequisiteIds?: number[];
}