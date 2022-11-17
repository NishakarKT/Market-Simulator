import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    stocks: { type: Number, default: 0, required: true },
    fiats: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    mode: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: String, required: true },
    price: { type: String, required: true },
    isHandled: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const User = new mongoose.model("users", userSchema);
export const Order = new mongoose.model("orders", orderSchema);
