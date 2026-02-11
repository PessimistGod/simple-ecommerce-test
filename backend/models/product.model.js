import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../constants/categories.js";
import { PRODUCT_UOMS } from "../constants/uom.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },

  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
    required: true,
    index: true
  },

  mrp: { type: Number, required: true },
  distributorPrice: { type: Number, required: true },
  retailerPrice: { type: Number, required: true },

  uom: {
    type: String,
    enum: PRODUCT_UOMS,
    required: true
  },

  uomQuantity: {
    type: Number,
    required: true
  },

  crt: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
