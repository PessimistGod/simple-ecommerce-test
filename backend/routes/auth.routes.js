import express from "express";
import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address
    } = req.body;

    const exists = await Customer.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already used" });

    await Customer.create({
      name,
      email,
      phone,
      passwordHash: password,
      addresses: [address],
      preferredAddressIndex: 0
    });

    res.json({ message: "Registered successfully" });
  } catch {
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
