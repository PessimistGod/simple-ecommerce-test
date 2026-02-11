import express from "express";
import { connectDB } from "./config/db.js";
import seedRoutes from "./routes/seed.routes.js";
import shopRoutes from "./routes/shop.routes.js";

const app = express();
await connectDB();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/seed", seedRoutes);
app.use("/api/shop", shopRoutes);

app.listen(3000, () => console.log("Demo shop at http://localhost:3000"));
