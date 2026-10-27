import { Router } from "express";

import {
  register,
  login,
  me
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middlewares/auth.js";
import { handle } from "../utils/http.js";

const router = Router();

router.post("/register", handle(register));
router.post("/login", handle(login));

router.get(
  "/me",
  requireAuth,
  handle(me)
);

export default router;