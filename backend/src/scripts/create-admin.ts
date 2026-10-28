import mongoose from "mongoose";

import {
  createInterface
} from "node:readline/promises";

import {
  stdin as input,
  stdout as output
} from "node:process";

import connectDB from "../config/db.js";
import { User } from "../models/User.js";

import {
  hashPassword
} from "../utils/security.js";

async function main() {
  const rl = createInterface({
    input,
    output
  });

  let email = "";
  let password = "";
  let name = "";

  try {
    name = (
      await rl.question("Admin name: ")
    ).trim();

    email = (
      await rl.question("Admin email: ")
    ).trim().toLowerCase();

    password = await rl.question(
      "Admin password (visible while typing): "
    );
  } finally {
    rl.close();
  }

  if (
    name.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    password.length < 12
  ) {
    throw new Error(
      "Name >=2, valid email and password >=12 chars required"
    );
  }

  await connectDB();

  const existing = await User.findOne({
    email
  });

  if (existing) {
    throw new Error(
      "Email is already registered. Choose a new admin email."
    );
  }

  await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    status: "active"
  });

  console.log(
    "Admin created. Log in using POST /api/auth/login"
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