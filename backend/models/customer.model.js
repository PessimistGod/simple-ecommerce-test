import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,

  country: {
    name: String,
    isoCode: String
  },

  state: {
    name: String,
    isoCode: String
  },

  city: String,

  postalCode: String
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

  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  },

  addresses: [addressSchema],

  preferredAddressIndex: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

customerSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
});

customerSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model("Customer", customerSchema);
