
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";

import { body, handle, HttpError } from "../utils/http.js";
import { requireAuth, type Actor } from "../middlewares/auth.js";
import { askAI, type AssistantKind } from "../services/ai.service.js";
import { buildAIContext } from "../services/ai-context.js";

const router = Router();

const schema = z.object({
  message: z.string().trim().min(2).max(1200),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(1200),
    }).strict()
  ).max(6).default([]),
}).strict();

const publicLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const privateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (_req, res) => {
    const actor = res.locals.actor as Actor;
    return `user:${actor.id}`;
  },
});

router.post(
  "/public",
  publicLimit,
  handle(async (req, res) => {
    const { message, history } = body(schema, req.body);
    const context = await buildAIContext("public");
    const answer = await askAI(
      "public",
      message,
      history,
      context
    );

    res.json({
      success: true,
      data: { answer },
    });
  })
);

router.post(
  "/:kind",
  requireAuth,
  privateLimit,
  handle(async (req, res) => {
    const actor = res.locals.actor as Actor;
    const kind = req.params.kind;

    if (
      typeof kind !== "string" ||
      !["customer", "worker", "admin"].includes(kind)
    ) {
      throw new HttpError(404, "Unknown assistant");
    }

    if (actor.role !== kind) {
      throw new HttpError(
        403,
        "This assistant belongs to another role"
      );
    }

    const { message, history } = body(schema, req.body);

    const context = await buildAIContext(
      kind as Actor["role"],
      actor
    );

    const answer = await askAI(
      kind as AssistantKind,
      message,
      history,
      context
    );

    res.json({
      success: true,
      data: { answer },
    });
  })
);

export default router;
