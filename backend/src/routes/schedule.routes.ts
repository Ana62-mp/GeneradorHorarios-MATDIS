import { Router } from "express";

import {
  deleteScheduleGenerationController,
  generateSchedulesController,
  getScheduleGenerationController,
  listScheduleGenerationsController,
} from "../controllers/schedule.controller.js";

const router = Router();

/**
 * @openapi
 * /schedules/generate:
 *   post:
 *     summary: Genera, evalúa y almacena horarios
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleConfigurationInput'
 *     responses:
 *       201:
 *         description: Horarios generados y almacenados correctamente
 *       400:
 *         description: Configuración inválida
 *       500:
 *         description: Error interno del servidor
 */
router.post("/generate", generateSchedulesController);

/**
 * @openapi
 * /schedules:
 *   get:
 *     summary: Obtiene el historial de generaciones
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", listScheduleGenerationsController);

/**
 * @openapi
 * /schedules/{id}:
 *   get:
 *     summary: Obtiene el detalle de una generación
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Generación obtenida correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Generación no encontrada
 */
router.get("/:id", getScheduleGenerationController);

/**
 * @openapi
 * /schedules/{id}:
 *   delete:
 *     summary: Elimina una generación y todos sus horarios
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Generación eliminada correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Generación no encontrada
 */
router.delete("/:id", deleteScheduleGenerationController);

export default router;
