import { Router } from "express";

import {
  listPayments,
  markPayment
} from "../controllers/payments.controller.js";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  handle(listPayments)
);

router.patch(
  "/:id",
  requireAuth,
  roles("admin"),
  handle(markPayment)
);

export default router;