
import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["cash", "manual"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "refunded", "void"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Payment: mongoose.Model<any> =
  (mongoose.models.Payment ??
    mongoose.model("Payment", schema)) as mongoose.Model<any>;
