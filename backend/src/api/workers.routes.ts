import { Router } from "express";

import {
  listWorkers,
  getWorker,
  myWorkerProfile,
  updateWorkerProfile
} from "../controllers/workers.controller.js";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.get(
  "/",
  handle(listWorkers)
);

router.get(
  "/me",
  requireAuth,
  roles("worker"),
  handle(myWorkerProfile)
);

router.patch(
  "/me",
  requireAuth,
  roles("worker"),
  handle(updateWorkerProfile)
);

router.get(
  "/:id",
  handle(getWorker)
);

export default router;