import { Router } from "express";

import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService
} from "../controllers/services.controller.js";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.get(
  "/",
  handle(listServices)
);

router.get(
  "/:id",
  handle(getService)
);

router.post(
  "/",
  requireAuth,
  roles("admin"),
  handle(createService)
);

router.patch(
  "/:id",
  requireAuth,
  roles("admin"),
  handle(updateService)
);

router.delete(
  "/:id",
  requireAuth,
  roles("admin"),
  handle(deleteService)
);

export default router;