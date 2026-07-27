import type {NextFunction, Request, Response,} from "express";

import {createCourse,deleteCourse,getAllCourses,getCourseById, updateCourse,} from "../services/course.service.js";

import { validateCourseInput } from "../validators/course.validator.js";
import { HttpError } from "../utils/httpError.js";

function getCourseId(parameter: string): number {
  const id = Number(parameter);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "El ID de la materia no es válido");
  }

  return id;
}

export async function listCoursesController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const courses = await getAllCourses();

    response.status(200).json({
      message: "Materias obtenidas correctamente",
      total: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseController(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    const id = getCourseId(request.params.id);

    const course = await getCourseById(id);

    response.status(200).json({
      message: "Materia obtenida correctamente",
      course,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCourseController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const data = validateCourseInput(request.body);

    const course = await createCourse(data);

    response.status(201).json({
      message: "Materia registrada correctamente",
      course,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCourseController(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    const id = getCourseId(request.params.id);
    const data = validateCourseInput(request.body);

    const course = await updateCourse(id, data);

    response.status(200).json({
      message: "Materia actualizada correctamente",
      course,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCourseController(
  request: Request<{ id: string }>,
  response: Response,
  next: NextFunction,
) {
  try {
    const id = getCourseId(request.params.id);

    const deletedCourse = await deleteCourse(id);

    response.status(200).json({
      message: "Materia eliminada correctamente",
      course: deletedCourse,
    });
  } catch (error) {
    next(error);
  }
}