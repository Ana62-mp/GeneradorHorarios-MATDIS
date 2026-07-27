import { Router } from "express";

import {
  createCourseController,
  deleteCourseController,
  getCourseController,
  listCoursesController,
  updateCourseController,
} from "../controllers/course.controller.js";

const router = Router();

router.post("/", createCourseController);
router.get("/", listCoursesController);
router.get("/:id", getCourseController);
router.put("/:id", updateCourseController);
router.delete("/:id", deleteCourseController);

export default router;