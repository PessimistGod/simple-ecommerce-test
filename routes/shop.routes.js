import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";

const router = express.Router();

const DEMO_EMAIL = "rahul@test.com";

router.get("/data", async (req, res) => {
  const customer = await Customer.findOne({ email: DEMO_EMAIL });

  const products = await Product.find();

  const cart = await Cart.findOne({ customer: customer?._id })
    .populate("items.product");

  const orders = await Order.find({ customer: customer?._id });

  res.json({ products, cart, orders });
});


router.post("/add/:id", async (req, res) => {
  const customer = await Customer.findOne({ email: DEMO_EMAIL });
  const cart = await Cart.findOne({ customer: customer._id });
  const product = await Product.findById(req.params.id);

  const existing = cart.items.find(i => i.product.equals(product._id));

  if (existing) existing.quantity++;
  else cart.items.push({ product: product._id, quantity: 1, priceSnapshot: product.price });

  await cart.save();
  res.json(cart);
});

router.post("/checkout", async (req, res) => {
  const customer = await Customer.findOne({ email: DEMO_EMAIL });
  const cart = await Cart.findOne({ customer: customer._id }).populate("items.product");

  if (!cart.items.length) return res.json({ message: "Cart empty" });

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
    customer: customer._id,
    items,
    shippingAddress: customer.addresses[0],
    totalAmount: total,
    status: "PAID"
  });

  for (const i of cart.items) {
    await Product.findByIdAndUpdate(i.product._id, { $inc: { stock: -i.quantity }});
  }

  cart.items = [];
  await cart.save();

  res.json(order);
});

export default router;
