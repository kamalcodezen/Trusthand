import type { RequestHandler } from "express";
import { z } from "zod";

import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Booking } from "../models/Booking.js";

import {
  body,
  id,
  HttpError,
  q
} from "../utils/http.js";

import type { Actor } from "../middlewares/auth.js";
import { optionalAddress } from "../services/location.service.js";

const schema = z.object({
  bio: z.string().max(1000).optional(),

  experienceYears: z.number()
    .int()
    .min(0)
    .max(70)
    .optional(),

  startingPrice: z.number()
    .min(0)
    .max(1000000)
    .optional(),

  services: z.array(z.string())
    .max(15)
    .optional(),

  available: z.boolean().optional(),
  area: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),

  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional()
}).strict();


const publicFields =
  "name area division district upazila bio experienceYears startingPrice services available verificationStatus isDemo createdAt";


function escapeRegExp(value: string) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

export const listWorkers: RequestHandler =
  async (req, res) => {
    const filter: any = {
      role: "worker",
      status: "active",
      verificationStatus: "approved"
    };

    const area = q(req, "area");
    const service = q(req, "service");
    const search = q(req, "search");

    for (
      const key of [
        "division",
        "district",
        "upazila"
      ] as const
    ) {
      const value = q(req, key);

      if (value) {
        filter[key] = value;
      }
    }

    if (area) {
      filter.area = {
        $regex: escapeRegExp(area.slice(0, 80)),
        $options: "i"
      };
    }

    if (service) {
      filter.services = id(service);
    }

    if (search) {
      filter.name = {
        $regex: escapeRegExp(search.slice(0, 80)),
        $options: "i"
      };
    }

    if (q(req, "available") === "true") {
      filter.available = true;
    }

    const workers = await User.find(filter)
      .select(publicFields)
      .populate(
        "services",
        "name slug category basePrice"
      )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const workerIds = workers.map(
      (w: any) => w._id
    );

    const [reviews, jobs] = await Promise.all([
      Review.aggregate([
        {
          $match: {
            worker: { $in: workerIds }
          }
        },
        {
          $group: {
            _id: "$worker",
            rating: { $avg: "$rating" },
            reviewCount: { $sum: 1 }
          }
        }
      ]),

      Booking.aggregate([
        {
          $match: {
            worker: { $in: workerIds },
            status: "completed"
          }
        },
        {
          $group: {
            _id: "$worker",
            completedJobs: { $sum: 1 }
          }
        }
      ])
    ]);

    const scores = new Map(
      reviews.map((r: any) => [
        String(r._id),
        r
      ])
    );

    const jobCounts = new Map(
      jobs.map((r: any) => [
        String(r._id),
        r.completedJobs
      ])
    );

    const data = workers.map(
      (w: any) => ({
        ...w,

        rating:
          scores.get(String(w._id))?.rating ?? 0,

        reviewCount:
          scores.get(String(w._id))?.reviewCount ?? 0,

        completedJobs:
          jobCounts.get(String(w._id)) ?? 0
      })
    );

    res.json({
      success: true,
      data
    });
  };

export const getWorker: RequestHandler =
  async (req, res) => {
    const worker = await User.findOne({
      _id: id(req.params.id),
      role: "worker",
      status: "active",
      verificationStatus: "approved"
    })
      .select(publicFields)
      .populate(
        "services",
        "name slug category basePrice"
      )
      .lean();

    if (!worker) {
      throw new HttpError(
        404,
        "Verified worker not found"
      );
    }

    const [aggregate, completedJobs] =
      await Promise.all([
        Review.aggregate([
          {
            $match: {
              worker: worker._id
            }
          },
          {
            $group: {
              _id: null,
              rating: { $avg: "$rating" },
              count: { $sum: 1 }
            }
          }
        ]),

        Booking.countDocuments({
          worker: worker._id,
          status: "completed"
        })
      ]);

    res.json({
      success: true,
      data: {
        ...worker,
        rating: aggregate[0]?.rating ?? 0,
        reviewCount: aggregate[0]?.count ?? 0,
        completedJobs
      }
    });
  };

export const myWorkerProfile: RequestHandler =
  async (_req, res) => {
    const actor = res.locals.actor as Actor;

    const worker = await User.findById(
      actor.id
    ).populate(
      "services",
      "name slug category"
    );

    res.json({
      success: true,
      data: worker
    });
  };

export const updateWorkerProfile: RequestHandler =
  async (req, res) => {
    const input = body(schema, req.body);
    const actor = res.locals.actor as Actor;

    const loc = await optionalAddress({
      division: input.division,
      district: input.district,
      upazila: input.upazila
    });

    Object.assign(input, loc);

    if (loc.upazila) {
      input.area = loc.upazila;
    }

    if (input.services) {
      const ids = input.services.map(x => id(x));

      const validCount =
        await Service.countDocuments({
          _id: { $in: ids },
          active: true
        });

      if (
        new Set(input.services).size !==
          input.services.length ||
        validCount !== ids.length
      ) {
        throw new HttpError(
          400,
          "Invalid or inactive service IDs"
        );
      }
    }

    const current = await User.findById(
      actor.id
    );

    if (!current) {
      throw new HttpError(
        404,
        "Worker not found"
      );
    }

    const serviceChange =
      input.services &&
      input.services.slice().sort().join(",") !==
        current.services
          .map((x: any) => String(x))
          .sort()
          .join(",");

    const locationChange = Boolean(
      loc.division &&
      (
        loc.division !== current.division ||
        loc.district !== current.district ||
        loc.upazila !== current.upazila
      )
    );

    const data: any = { ...input };

    if (serviceChange || locationChange) {
      data.verificationStatus = "pending";
    }

    const worker = await User.findByIdAndUpdate(
      actor.id,
      { $set: data },
      {
        new: true,
        runValidators: true
      }
    ).populate(
      "services",
      "name slug category"
    );

    res.json({
      success: true,
      data: worker
    });
  };