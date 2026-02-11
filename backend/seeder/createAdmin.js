import readline from "readline";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Customer from "../models/customer.model.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const createAdmin = async () => {
  try {
    await connectDB();

    console.log("\n=== Create Admin User ===\n");

    const name = await ask("Name: ");
    const email = await ask("Email: ");
    const phone = await ask("Phone: ");
    const password = await ask("Password: ");

    const exists = await Customer.findOne({ email });

    if (exists) {
      console.log("\nAdmin with this email already exists.");
      process.exit();
    }

    await Customer.create({
      name,
      email,
      phone,
      passwordHash: password,
      role: "ADMIN"
    });

    console.log("\nAdmin created successfully!");
    process.exit();

  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
