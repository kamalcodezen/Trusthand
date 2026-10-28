import mongoose from "mongoose";

import connectDB from "../config/db.js";

import {
  Location,
  type Division
} from "../models/Location.js";

const URL =
  "https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json";

async function main() {
  console.log(
    "Downloading Bangladesh location dataset..."
  );

  const response = await fetch(URL, {
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(
      `Geo source HTTP ${response.status}`
    );
  }

  const json: unknown = await response.json();

  if (!Array.isArray(json)) {
    throw new Error(
      "Unexpected geo data format"
    );
  }

  const divisions: Division[] = json.map(
    (division: any) => ({
      name: String(
        division.name || ""
      ),

      bnName: String(
        division.bn_name || ""
      ),

      districts: Array.isArray(
        division.districts
      )
        ? division.districts.map(
            (district: any) => ({
              name: String(
                district.name || ""
              ),

              bnName: String(
                district.bn_name || ""
              ),

              upazilas: Array.isArray(
                district.upazilas
              )
                ? district.upazilas.map(
                    (x: any) => ({
                      name: String(
                        x.name || ""
                      ),

                      bnName: String(
                        x.bn_name || ""
                      )
                    })
                  )
                : []
            })
          )
        : []
    })
  );

  const districtCount = divisions.reduce(
    (n, d) =>
      n + d.districts.length,
    0
  );

  const upazilaCount = divisions.reduce(
    (n, d) =>
      n +
      d.districts.reduce(
        (m, x) =>
          m + x.upazilas.length,
        0
      ),
    0
  );

  if (
    divisions.length !== 8 ||
    districtCount !== 64 ||
    upazilaCount < 490 ||
    divisions.some(
      d =>
        !d.name ||
        !d.bnName ||
        d.districts.some(
          x => !x.name || !x.bnName
        )
    )
  ) {
    throw new Error(
      `Incomplete location dataset: ${divisions.length}/${districtCount}/${upazilaCount}`
    );
  }

  await connectDB();

  await Location.updateOne(
    { key: "BD" },

    {
      $set: {
        divisions
      }
    },

    {
      upsert: true,
      runValidators: true
    }
  );

  console.log(
    `Location import SUCCESS: ${divisions.length} divisions, ${districtCount} districts, ${upazilaCount} upazilas`
  );
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() =>
    mongoose.disconnect()
  );