
import mongoose, { Schema } from "mongoose";

export const roles = [
  "customer",
  "worker",
  "admin",
] as const;

export const accountStatus = [
  "active",
  "suspended",
] as const;

export const verification = [
  "pending",
  "approved",
  "rejected",
] as const;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    area: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
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

    role: {
      type: String,
      enum: roles,
      default: "customer",
    },

    status: {
      type: String,
      enum: accountStatus,
      default: "active",
    },

    verificationStatus: {
      type: String,
      enum: verification,
      default: "pending",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
      max: 70,
    },

    startingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    available: {
      type: Boolean,
      default: true,
    },

    isDemo: {
      type: Boolean,
      default: false,
    },

    sessionVersion: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        Reflect.deleteProperty(ret, "passwordHash");
        Reflect.deleteProperty(ret, "sessionVersion");
        return ret;
      },
    },
  }
);

schema.index({
  role: 1,
  division: 1,
  district: 1,
  upazila: 1,
  verificationStatus: 1,
});

export const User: mongoose.Model<any> =
  (mongoose.models.User ??
    mongoose.model("User", schema)) as mongoose.Model<any>;
