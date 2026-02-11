import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  phone: String,

  passwordHash: {
    type: String,
    required: true,
    select: false
  },

  addresses: [addressSchema],

  preferredAddressIndex: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

customerSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
});


customerSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export default mongoose.model("Customer", customerSchema);
