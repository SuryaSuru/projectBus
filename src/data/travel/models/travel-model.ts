import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  travelName: { type: String },
  disabled: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

export const Travel = mongoose.model("Travel", travelSchema);