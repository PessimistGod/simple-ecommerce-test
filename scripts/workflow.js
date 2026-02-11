import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

const checkout = async () => {
  await connectDB();

  const customer = await Customer.findOne({ email: "rahul@test.com" });

  const cart = await Cart.findOne({ customer: customer._id })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    console.log("Cart is empty");
    return;
  }

  let subtotal = 0;

  const orderItems = cart.items.map(item => {
    subtotal += item.quantity * item.priceSnapshot;

    return {
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.priceSnapshot
    };
  });

  const tax = subtotal * 0.18;
  const shippingFee = 100;
  const totalAmount = subtotal + tax + shippingFee;

  const order = await Order.create({
    customer: customer._id,
    items: orderItems,
    shippingAddress: customer.addresses[0],
    subtotal,
    tax,
    shippingFee,
    totalAmount,
    status: "PAID",
    paymentMethod: "COD",
    paidAt: new Date()
  });

  console.log("Order Created:", order._id);

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } }
    );
  }

  console.log("Stock Updated");

  cart.items = [];
  await cart.save();

  console.log("Cart Cleared");

  process.exit();
};

checkout();
