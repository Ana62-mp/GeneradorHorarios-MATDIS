import {
  DAYS,
  DIFFICULTIES,
  MODALITIES,
  type CourseInput,
} from "../types/course.types.js";

import { HttpError } from "../utils/httpError.js";
import { timeToMinutes } from "../utils/time.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidOption(
  value: unknown,
  options: readonly string[],
): value is string {
  return typeof value === "string" && options.includes(value);
}

export function validateCourseInput(body: unknown): CourseInput {
  if (!isObject(body)) {
    throw new HttpError(400, "El cuerpo de la solicitud no es válido");
  }

  const {
    name,
    section,
    day,
    startTime,
    endTime,
    modality,
    difficulty,
    credits,
    prerequisiteIds = [],
  } = body;

  if (typeof name !== "string" || name.trim().length < 2) {
    throw new HttpError(
      400,
      "El nombre de la materia debe tener al menos 2 caracteres",
    );
  }

  if (
    section !== undefined &&
    section !== null &&
    typeof section !== "string"
  ) {
    throw new HttpError(400, "La sección debe ser un texto");
  }

  if (!isValidOption(day, DAYS)) {
    throw new HttpError(400, "El día seleccionado no es válido");
  }

  if (typeof startTime !== "string" || typeof endTime !== "string") {
    throw new HttpError(400, "La hora de inicio y finalización son obligatorias");
  }

  if (!isValidOption(modality, MODALITIES)) {
    throw new HttpError(400, "La modalidad no es válida");
  }

  if (!isValidOption(difficulty, DIFFICULTIES)) {
    throw new HttpError(400, "La dificultad no es válida");
  }

  if (
    typeof credits !== "number" ||
    !Number.isInteger(credits) ||
    credits <= 0
  ) {
    throw new HttpError(
      400,
      "Los créditos deben ser un número entero mayor que cero",
    );
  }

  if (!Array.isArray(prerequisiteIds)) {
    throw new HttpError(
      400,
      "Los prerrequisitos deben enviarse dentro de un arreglo",
    );
  }

  const invalidPrerequisite = prerequisiteIds.some(
    (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0,
  );

  if (invalidPrerequisite) {
    throw new HttpError(
      400,
      "Los identificadores de prerrequisitos no son válidos",
    );
  }

  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    throw new HttpError(
      400,
      "La hora de inicio debe ser anterior a la hora de finalización",
    );
  }

  const validatedDay = day as (typeof DAYS)[number];
  const validatedModality = modality as (typeof MODALITIES)[number];
  const validatedDifficulty = difficulty as (typeof DIFFICULTIES)[number];

  return {
    name: name.trim(),
    section:
      typeof section === "string" && section.trim()
        ? section.trim()
        : null,
    day: validatedDay,
    startTime,
    endTime,
    modality: validatedModality,
    difficulty: validatedDifficulty,
    credits,
    prerequisiteIds: [...new Set(prerequisiteIds)],
  };
}