import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { Service } from "../models/Service.js";

type SeedService = {
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  description: string;
};

const services: SeedService[] = [
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    category: "Cleaning",
    basePrice: 1000,
    description: "Reliable general home cleaning",
  },
  {
    name: "Deep Cleaning",
    slug: "deep-cleaning",
    category: "Cleaning",
    basePrice: 2200,
    description: "Whole-home intensive cleaning",
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    category: "Home Repair",
    basePrice: 700,
    description: "Plumbing repairs and maintenance",
  },
  {
    name: "Electrical Repair",
    slug: "electrical-repair",
    category: "Home Repair",
    basePrice: 800,
    description: "Safe household electrical work",
  },
  {
    name: "AC Servicing",
    slug: "ac-servicing",
    category: "Appliances",
    basePrice: 1200,
    description: "Air conditioner cleaning and maintenance",
  },
  {
    name: "Painting",
    slug: "painting",
    category: "Home Improvement",
    basePrice: 1800,
    description: "Walls, ceilings and decorative painting",
  },
];

async function main() {
  await connectDB();

  for (const service of services) {
    await Service.updateOne(
      { slug: service.slug },
      {
        $setOnInsert: {
          ...service,
          active: true,
        },
      },
      {
        upsert: true,
        runValidators: true,
      }
    );
  }

  console.log(
    "Default services ready:",
    services.length
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });