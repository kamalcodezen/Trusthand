
import mongoose, { Schema } from "mongoose";

export const bookingStatuses = [
  "pending",
  "quoted",
  "confirmed",
  "in_progress",
  "awaiting_completion",
  "completed",
  "cancelled",
] as const;

const quoteSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 10000000,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    estimatedHours: {
      type: Number,
      min: 0.5,
      max: 240,
      default: 1,
    },
    offeredAt: {
      type: Date,
      required: true,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    declinedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    division: {
      type: String,
      trim: true,
      default: "",
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    upazila: {
      type: String,
      trim: true,
      default: "",
    },
    note: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    estimatedAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Agreed price; zero until customer accepts.
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    quote: {
      type: quoteSchema,
      default: undefined,
    },
    status: {
      type: String,
      enum: bookingStatuses,
      default: "pending",
      index: true,
    },
    completionRequestedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

schema.index({ worker: 1, scheduledAt: 1 });
schema.index({ customer: 1, createdAt: -1 });

export const Booking: mongoose.Model<any> =
  (mongoose.models.Booking ??
    mongoose.model("Booking", schema)) as mongoose.Model<any>;
