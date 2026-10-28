import { Router } from "express";

import {
  updateMe,
} from "../controllers/users.controller.js";

import {
  requireAuth,
} from "../middlewares/auth.js";

import {
  handle,
} from "../utils/http.js";

const router = Router();

router.patch(
  "/me",
  requireAuth,
  handle(updateMe)
);

export default router;