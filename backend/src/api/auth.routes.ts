
import { Router } from "express";

import {
  register,
  login,
  me,
  logout,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middlewares/auth.js";
import { handle } from "../utils/http.js";

const router = Router();

router.post("/register", handle(register));
router.post("/login", handle(login));

router.get("/me", requireAuth, handle(me));
router.post("/logout", requireAuth, handle(logout));

export default router;
