import mongoose, { Schema } from "mongoose";

export const bookingStatuses = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled"
] as const;

const schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    division: {
      type: String,
      trim: true,
      default: ""
    },

    district: {
      type: String,
      trim: true,
      default: ""
    },

    upazila: {
      type: String,
      trim: true,
      default: ""
    },

    note: {
      type: String,
      default: "",
      maxlength: 1000
    },

    scheduledAt: {
      type: Date,
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: bookingStatuses,
      default: "pending"
    }
  },
  { timestamps: true }
);

schema.index({
  worker: 1,
  scheduledAt: 1
});

export const Booking: mongoose.Model<any> =
  (mongoose.models.Booking ??
    mongoose.model("Booking", schema)) as mongoose.Model<any>;