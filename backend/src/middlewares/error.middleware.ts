import type {
  ErrorRequestHandler,
  RequestHandler,
} from "express";

import { HttpError } from "../utils/httpError.js";

export const notFoundHandler: RequestHandler = (
  request,
  response,
) => {
  response.status(404).json({
    message: `La ruta ${request.method} ${request.originalUrl} no existe`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  console.error("Error no controlado:", error);

  response.status(500).json({
    message: "Ocurrió un error interno en el servidor",
  });
};