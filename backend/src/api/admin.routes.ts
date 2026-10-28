import { Router } from "express";

import {
  requireAuth,
  roles
} from "../middlewares/auth.js";

import { handle } from "../utils/http.js";

import {
  getOverview,
  listUsers,
  listWorkersAdmin,
  listBookingsAdmin,
  listPaymentsAdmin,
  getAdminSettings,
  updateAdminSettings,
  updateUserStatus,
  updateWorkerStatus,
  adminChangeBooking
} from "../controllers/admin.controller.js";

const router = Router();

router.use(
  requireAuth,
  roles("admin")
);

router.get(
  "/overview",
  handle(getOverview)
);

router.get(
  "/users",
  handle(listUsers)
);

router.get(
  "/workers",
  handle(listWorkersAdmin)
);

router.get(
  "/bookings",
  handle(listBookingsAdmin)
);

router.get(
  "/payments",
  handle(listPaymentsAdmin)
);

router.get(
  "/settings",
  handle(getAdminSettings)
);

router.patch(
  "/users/:id",
  handle(updateUserStatus)
);

router.patch(
  "/workers/:id",
  handle(updateWorkerStatus)
);

router.patch(
  "/bookings/:id",
  handle(adminChangeBooking)
);

router.put(
  "/settings",
  handle(updateAdminSettings)
);

export default router;