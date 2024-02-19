import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  ownerId: { type: String },
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

ownerSchema.pre('save', function (next) {
  if (!this.ownerId) {
    // Generate ownerId if not provided
    this.ownerId = generateOwnerId();
  }
  next();
});

function generateOwnerId() {
  // Generate random 6-digit alphanumeric string starting with "USE"
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "OWN" + randomId;
}

export const Owner = mongoose.model("Owner", ownerSchema);