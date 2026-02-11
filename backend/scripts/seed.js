import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/product.model.js";

const products = [
  {
    name: "Wooden Chair",
    category: "Furniture",
    mrp: 1200,
    distributorPrice: 900,
    retailerPrice: 1000,
    uom: "PCS",
    uomQuantity: 1,
    crt: 10,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1582582494700-7c63b5fa7b8b"
  },
  {
    name: "Modern Sofa",
    category: "Furniture",
    mrp: 25000,
    distributorPrice: 21000,
    retailerPrice: 23000,
    uom: "PCS",
    uomQuantity: 1,
    crt: 2,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
  },
  {
    name: "Office Table",
    category: "Furniture",
    mrp: 8000,
    distributorPrice: 6500,
    retailerPrice: 7200,
    uom: "PCS",
    uomQuantity: 1,
    crt: 5,
    stock: 17,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
  },

  {
    name: "Basmati Rice 1kg",
    category: "Groceries",
    mrp: 120,
    distributorPrice: 95,
    retailerPrice: 110,
    uom: "KG",
    uomQuantity: 1,
    crt: 20,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1586201375754-1f7b4a0a5bdb"
  },
  {
    name: "Sunflower Oil 1L",
    category: "Groceries",
    mrp: 180,
    distributorPrice: 150,
    retailerPrice: 165,
    uom: "LITER",
    uomQuantity: 1,
    crt: 12,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686c5c47f4"
  },

  {
    name: "Running Shoes",
    category: "Sports",
    mrp: 3500,
    distributorPrice: 2800,
    retailerPrice: 3200,
    uom: "PCS",
    uomQuantity: 1,
    crt: 6,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  },
  {
    name: "Football",
    category: "Sports",
    mrp: 1200,
    distributorPrice: 900,
    retailerPrice: 1050,
    uom: "PCS",
    uomQuantity: 1,
    crt: 10,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d"
  },

  {
    name: "LED TV 42 inch",
    category: "Electronics",
    mrp: 32000,
    distributorPrice: 28000,
    retailerPrice: 30000,
    uom: "PCS",
    uomQuantity: 1,
    crt: 1,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04"
  },
  {
    name: "Bluetooth Headphones",
    category: "Electronics",
    mrp: 3000,
    distributorPrice: 2200,
    retailerPrice: 2700,
    uom: "PCS",
    uomQuantity: 1,
    crt: 20,
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231693"
  },

  {
    name: "Men T-Shirt",
    category: "Clothing",
    mrp: 800,
    distributorPrice: 550,
    retailerPrice: 700,
    uom: "PCS",
    uomQuantity: 1,
    crt: 30,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
  },
  {
    name: "Jeans Pant",
    category: "Clothing",
    mrp: 1800,
    distributorPrice: 1400,
    retailerPrice: 1650,
    uom: "PCS",
    uomQuantity: 1,
    crt: 20,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d"
  },

  {
    name: "Cookware Set",
    category: "Home Appliances",
    mrp: 4500,
    distributorPrice: 3600,
    retailerPrice: 4200,
    uom: "PACK",
    uomQuantity: 1,
    crt: 6,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  },

  {
    name: "Novel Book",
    category: "Books",
    mrp: 500,
    distributorPrice: 350,
    retailerPrice: 450,
    uom: "PCS",
    uomQuantity: 1,
    crt: 40,
    stock: 300,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794"
  },

  {
    name: "Face Cream",
    category: "Beauty",
    mrp: 650,
    distributorPrice: 480,
    retailerPrice: 600,
    uom: "ML",
    uomQuantity: 100,
    crt: 24,
    stock: 180,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571"
  },

  {
    name: "Shampoo Bottle",
    category: "Beauty",
    mrp: 350,
    distributorPrice: 260,
    retailerPrice: 310,
    uom: "ML",
    uomQuantity: 200,
    crt: 36,
    stock: 240,
    imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
  }
];

const seed = async () => {
  try {
    await connectDB();

    await mongoose.connection.dropDatabase();
    console.log("Database Cleared");

    await Product.insertMany(products);
    console.log("15 Products Seeded Successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
