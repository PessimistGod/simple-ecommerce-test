import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import seedRoutes from "./routes/seed.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import clearRoutes from "./routes/clear.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/seed", seedRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/clear", clearRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect DB once
connectDB();

export default app;
