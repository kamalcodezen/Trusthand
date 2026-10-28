import { Router } from "express";

import {
  createReview,
  listWorkerReviews,
  myReviews,
  editReview,
  deleteReview
} from "../controllers/reviews.controller.js";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.get(
  "/worker/:workerId",
  handle(listWorkerReviews)
);

router.get(
  "/mine",
  requireAuth,
  roles("customer"),
  handle(myReviews)
);

router.post(
  "/",
  requireAuth,
  roles("customer"),
  handle(createReview)
);

router.patch(
  "/:id",
  requireAuth,
  roles("customer"),
  handle(editReview)
);

router.delete(
  "/:id",
  requireAuth,
  roles("customer"),
  handle(deleteReview)
);

export default router;