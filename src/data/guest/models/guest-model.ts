import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  guestName: { type: String },
  contactInfo: { type: String },
  address: { type: String }
}, { 
  timestamps: true 
});

export const Guest = mongoose.model("Guest", guestSchema);