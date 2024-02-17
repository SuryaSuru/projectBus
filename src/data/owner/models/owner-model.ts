import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  pancardNumber: { type: String, required: true },
  photo: { type: String },
  address: { type: String },
  isVerified: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Owner = mongoose.model("Owner", ownerSchema);