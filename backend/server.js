import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import seedRoutes from "./routes/seed.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import clearRoutes from "./routes/clear.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/clear", clearRoutes);

// Start server locally
const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
};

start();
