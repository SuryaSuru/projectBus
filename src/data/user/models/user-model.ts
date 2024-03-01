import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  email: { type: String },
  info: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  type: { type: String, enum: ['User', 'Admin', 'Staff'], default: 'User' },
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  userSchema.methods.matchPassword = async function (password: string){
  return await bcrypt.compare(password, this.password);
};

// userSchema.methods.generateToken = function (): string {
  userSchema.methods.generateToken = function (){
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined');
  }
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

export const User = mongoose.model("User", userSchema); // Export User model
