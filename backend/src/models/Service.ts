import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 90
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Service: mongoose.Model<any> =
  (mongoose.models.Service ??
    mongoose.model("Service", schema)) as mongoose.Model<any>;