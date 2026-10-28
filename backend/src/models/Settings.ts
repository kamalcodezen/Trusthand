import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "main",
    },

    serviceFeePercent: {
      type: Number,
      min: 0,
      max: 30,
      default: 10,
    },

    supportEmail: {
      type: String,
      default: "support@trusthand.local",
    },
  },
  { timestamps: true }
);

export const Settings: mongoose.Model<any> =
  (mongoose.models.Settings ??
    mongoose.model("Settings", schema)) as mongoose.Model<any>;

export async function getSettings() {
  const item = await Settings.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        serviceFeePercent: 10,
        supportEmail: "support@trusthand.local",
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  if (!item) {
    throw new Error("Unable to load platform settings");
  }

  return item;
}