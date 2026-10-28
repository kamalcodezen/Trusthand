import mongoose, { Schema } from "mongoose";

export type Place = {
  name: string;
  bnName: string;
};

export type District = Place & {
  upazilas: Place[];
};

export type Division = Place & {
  districts: District[];
};

const schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "BD"
    },

    divisions: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

export const Location: mongoose.Model<any> =
  (mongoose.models.Location ??
    mongoose.model("Location", schema)) as mongoose.Model<any>;