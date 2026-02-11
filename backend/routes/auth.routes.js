import express from "express";
import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER PAYLOAD:", req.body); // 👈 add this

    const exists = await Customer.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const user = new Customer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: req.body.password,
      addresses: [req.body.address]
    });

    await user.save();

    console.log("USER CREATED:", user); // 👈 add this

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});


/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Customer.findOne({ email }).select("+passwordHash");
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const valid = await user.comparePassword(password);
  if (!valid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login success",
    token
  });
});

export default router;
