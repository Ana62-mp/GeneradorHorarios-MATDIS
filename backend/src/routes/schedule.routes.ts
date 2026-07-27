import { Router } from "express";

import {
  deleteScheduleGenerationController,
  generateSchedulesController,
  getScheduleGenerationController,
  listScheduleGenerationsController,
} from "../controllers/schedule.controller.js";

const router = Router();

router.post(
  "/generate",
  generateSchedulesController,
);

router.get(
  "/",
  listScheduleGenerationsController,
);

router.get(
  "/:id",
  getScheduleGenerationController,
);

router.delete(
  "/:id",
  deleteScheduleGenerationController,
);

export default router;