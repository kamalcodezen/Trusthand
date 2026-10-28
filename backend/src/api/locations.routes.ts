import { Router } from "express";

import {
  divisions,
  districts,
  upazilas
} from "../controllers/locations.controller.js";

import { handle } from "../utils/http.js";

const router = Router();

router.get(
  "/divisions",
  handle(divisions)
);

router.get(
  "/districts",
  handle(districts)
);

router.get(
  "/upazilas",
  handle(upazilas)
);

export default router;