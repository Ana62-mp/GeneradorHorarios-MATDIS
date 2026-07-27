import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  deleteScheduleGeneration,
  generateSchedules,
  getScheduleGenerationById,
  getScheduleGenerations,
} from "../services/schedule.service.js";

import { validateScheduleConfiguration } from "../validators/schedule.validator.js";

import { HttpError } from "../utils/httpError.js";

function getGenerationId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(
      400,
      "El ID de la generación no es válido",
    );
  }

  return id;
}

export async function generateSchedulesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const configuration =
      validateScheduleConfiguration(request.body);

    const result = await generateSchedules(
      configuration,
    );

    response.status(201).json({
      message:
        "Horarios generados y almacenados correctamente",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listScheduleGenerationsController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const generations =
      await getScheduleGenerations();

    response.status(200).json({
      message:
        "Historial obtenido correctamente",
      total: generations.length,
      generations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getScheduleGenerationController(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    const id = getGenerationId(
      request.params.id,
    );

    const generation =
      await getScheduleGenerationById(id);

    response.status(200).json({
      message:
        "Generación obtenida correctamente",
      generation,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScheduleGenerationController(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    const id = getGenerationId(
      request.params.id,
    );

    await deleteScheduleGeneration(id);

    response.status(200).json({
      message:
        "Generación eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
}