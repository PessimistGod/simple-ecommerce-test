import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Cart from "../models/cart.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await mongoose.connection.dropDatabase();

  const products = await Product.insertMany([
    { name: "Wooden Table", stock: 20, price: 5000, material: "Teak" },
    { name: "Chair", stock: 50, price: 1500, material: "Pine" },
    { name: "Sofa", stock: 10, price: 12000, material: "Leather" }
  ]);

  const customer = await Customer.create({
    name: "Rahul",
    email: "rahul@test.com",
    passwordHash: "password123",
    addresses: [{
      fullName: "Rahul",
      phone: "9999999999",
      street: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India"
    }]
  });

  await Cart.create({ customer: customer._id, items: [] });

  res.json({ message: "Demo store ready", productsCount: products.length });
});

export default router;
