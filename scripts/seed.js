import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Cart from "../models/cart.model.js";

const seed = async () => {
  await connectDB();

  await mongoose.connection.dropDatabase();
  console.log("Database Cleared");

  // Create products
  const products = await Product.insertMany([
    { name: "Wooden Table", stock: 20, price: 5000, material: "Teak" },
    { name: "Chair", stock: 50, price: 1500, material: "Pine" },
    { name: "Sofa", stock: 10, price: 12000, material: "Leather" }
  ]);

  console.log("Products Created");

  // Create customer
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

  console.log("Customer Created");

  // Create cart
  await Cart.create({
    customer: customer._id,
    items: [
      {
        product: products[0]._id,
        quantity: 2,
        priceSnapshot: products[0].price
      }
    ]
  });

  console.log("Cart Created");

  process.exit();
};

seed();
