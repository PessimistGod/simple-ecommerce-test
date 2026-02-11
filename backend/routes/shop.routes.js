import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================================
   GET PAGINATED PRODUCTS (PUBLIC OR USER)
========================================= */
router.get("/products", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = req.query.category
    ? { category: req.query.category }
    : {};

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter)
  ]);

  res.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
});


/* =========================================
   ADD TO CART (USER ONLY)
========================================= */
router.post("/cart/add/:id", protect, async (req, res) => {
  const userId = req.user.id;

  const customer = await Customer.findById(userId);
  if (!customer) return res.status(404).json({ message: "User not found" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ customer: userId });

  if (!cart) {
    cart = await Cart.create({ customer: userId, items: [] });
  }

  const existing = cart.items.find(i =>
    i.product.toString() === product._id.toString()
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
      product: product._id,
      quantity: 1,
      priceSnapshot: product.retailerPrice
    });
  }

  await cart.save();

  res.json(cart);
});

/* =========================================
   CHECKOUT (USER ONLY)
========================================= */
router.post("/checkout", protect, async (req, res) => {
  const userId = req.user.id;

  const customer = await Customer.findById(userId);
  if (!customer) return res.status(404).json({ message: "User not found" });

  const cart = await Cart.findOne({ customer: userId })
    .populate("items.product");

  if (!cart || !cart.items.length)
    return res.status(400).json({ message: "Cart empty" });

  let total = 0;

  const items = cart.items.map(i => {
    total += i.quantity * i.priceSnapshot;

    return {
      product: i.product._id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.priceSnapshot
    };
  });

  const order = await Order.create({
    customer: userId,
    items,
    shippingAddress: customer.addresses[customer.preferredAddressIndex],
    totalAmount: total,
    status: "PAID",
    paidAt: new Date()
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } }
    );
  }

  cart.items = [];
  await cart.save();

  res.json(order);
});

/* =========================================
   CREATE PRODUCT (ADMIN ONLY)
========================================= */
router.post("/product", protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});


// UPDATE PRODUCT
router.put("/product/:id", protect, adminOnly, async (req,res)=>{
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(p);
});

// DELETE PRODUCT
router.delete("/product/:id", protect, adminOnly, async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message:"Deleted" });
});


export default router;
