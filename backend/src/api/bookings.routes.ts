
import { Router } from "express";

import {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
  sendQuote,
  respondQuote,
} from "../controllers/bookings.controller.js";

import {
  requireAuth,
  roles,
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  handle(listBookings)
);

router.post(
  "/",
  roles("customer"),
  handle(createBooking)
);

router.get(
  "/:id",
  handle(getBooking)
);

router.post(
  "/:id/quote",
  roles("worker"),
  handle(sendQuote)
);

router.post(
  "/:id/quote/respond",
  roles("customer"),
  handle(respondQuote)
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
