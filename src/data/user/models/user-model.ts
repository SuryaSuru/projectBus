import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  email: { type: String },
  info: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  address: { type: String },
  isVerified: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (!this.userId) {
    // Generate userId if not provided
    this.userId = generateUserId();
  }
  next();
});

function generateUserId() {
  // Generate random 6-digit alphanumeric string starting with "USE"
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "USE" + randomId;
}

export const User = mongoose.model("User", userSchema);