import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000
    }
  },
  { timestamps: true }
);

schema.index({
  worker: 1,
  createdAt: -1
});

export const Review: mongoose.Model<any> =
  (mongoose.models.Review ??
    mongoose.model("Review", schema)) as mongoose.Model<any>;