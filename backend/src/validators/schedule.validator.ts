import {REQUIRED_MODALITIES, type RequiredModalityValue, type ScheduleConfigurationInput,} from "../types/schedule.types.js";
import { HttpError } from "../utils/httpError.js";

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validatePositiveInteger(
  value: unknown,
  fieldName: string,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new HttpError(
      400,
      `${fieldName} debe ser un número entero mayor que cero`,
    );
  }

  return value;
}

function validateNonNegativeInteger(
  value: unknown,
  fieldName: string,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    throw new HttpError(
      400,
      `${fieldName} debe ser un número entero mayor o igual a cero`,
    );
  }

  return value;
}

function validateIdArray(
  value: unknown,
  fieldName: string,
): number[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new HttpError(
      400,
      `${fieldName} debe ser un arreglo`,
    );
  }

  const hasInvalidId = value.some(
    (id) =>
      typeof id !== "number" ||
      !Number.isInteger(id) ||
      id <= 0,
  );

  if (hasInvalidId) {
    throw new HttpError(
      400,
      `${fieldName} contiene identificadores inválidos`,
    );
  }

  return [...new Set(value)];
}

export function validateScheduleConfiguration(
  body: unknown,
): ScheduleConfigurationInput {
  if (!isObject(body)) {
    throw new HttpError(
      400,
      "El cuerpo de la solicitud no es válido",
    );
  }

  const numberOfCourses = validatePositiveInteger(
    body.numberOfCourses,
    "numberOfCourses",
  );

  const maximumCredits = validatePositiveInteger(
    body.maximumCredits,
    "maximumCredits",
  );

  const maximumDifficultCourses =
    validateNonNegativeInteger(
      body.maximumDifficultCourses,
      "maximumDifficultCourses",
    );

  const requiredCourseIds = validateIdArray(
    body.requiredCourseIds,
    "requiredCourseIds",
  );

  const completedCourseIds = validateIdArray(
    body.completedCourseIds,
    "completedCourseIds",
  );

  const requiredModality =
    body.requiredModality ?? "CUALQUIERA";

  if (
    typeof requiredModality !== "string" ||
    !REQUIRED_MODALITIES.includes(
      requiredModality as RequiredModalityValue,
    )
  ) {
    throw new HttpError(
      400,
      "requiredModality debe ser CUALQUIERA, PRESENCIAL o VIRTUAL",
    );
  }

  const avoidTimeConflicts =
    body.avoidTimeConflicts ?? true;

  const validatePrerequisites =
    body.validatePrerequisites ?? true;

  if (typeof avoidTimeConflicts !== "boolean") {
    throw new HttpError(
      400,
      "avoidTimeConflicts debe ser verdadero o falso",
    );
  }

  if (typeof validatePrerequisites !== "boolean") {
    throw new HttpError(
      400,
      "validatePrerequisites debe ser verdadero o falso",
    );
  }

  if (requiredCourseIds.length > numberOfCourses) {
    throw new HttpError(
      400,
      "La cantidad de materias obligatorias supera la cantidad solicitada",
    );
  }

  return {
    numberOfCourses,
    maximumCredits,
    maximumDifficultCourses,
    requiredCourseIds,
    completedCourseIds,
    requiredModality:
      requiredModality as RequiredModalityValue,
    avoidTimeConflicts,
    validatePrerequisites,
  };
}