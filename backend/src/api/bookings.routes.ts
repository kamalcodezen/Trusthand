import { Router } from "express";

import {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookings.controller.js";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  roles("customer"),
  handle(createBooking)
);

router.get(
  "/",
  handle(listBookings)
);

router.get(
  "/:id",
  handle(getBooking)
);

router.patch(
  "/:id/status",
  handle(updateBookingStatus)
);

router.delete(
  "/:id",
  roles("customer"),
  handle(deleteBooking)
);

export default router;