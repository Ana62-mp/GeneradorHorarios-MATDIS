import { Router } from "express";

import {
  createCourseController,
  deleteCourseController,
  getCourseController,
  listCoursesController,
  updateCourseController,
} from "../controllers/course.controller.js";

const router = Router();

/**
 * @openapi
 * /courses:
 *   post:
 *     summary: Registra una nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       201:
 *         description: Materia registrada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createCourseController);

/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Obtiene todas las materias
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Materias obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", listCoursesController);

/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     summary: Obtiene una materia por su ID
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Materia obtenida correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Materia no encontrada
 */
router.get("/:id", getCourseController);

/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Actualiza una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente
 *       400:
 *         description: Datos o ID inválidos
 *       404:
 *         description: Materia no encontrada
 */
router.put("/:id", updateCourseController);

/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Elimina una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Materia eliminada correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Materia no encontrada
 */
router.delete("/:id", deleteCourseController);

export default router;
