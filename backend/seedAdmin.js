// run once => npm run seed:admin
// makes an admin account using ADMIN_ values from .env

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectToDb from "./src/connectToDb.js";
import User from "./src/schema/userSchema.js";

await connectToDb();

let email = process.env.ADMIN_EMAIL;
let oldAdmin = await User.findOne({ email: email });

if (oldAdmin) {
  console.log("admin already exists:", email);
} else {
  await User.create({
    name: process.env.ADMIN_NAME,
    email: email,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    phone: process.env.ADMIN_PHONE,
    role: "admin",
  });
  console.log("admin created:", email);
}

await mongoose.disconnect();
