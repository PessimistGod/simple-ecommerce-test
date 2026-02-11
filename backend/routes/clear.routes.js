import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
  await mongoose.connection.dropDatabase();
  res.json({ message: "Database cleared successfully" });
});

export default router;
