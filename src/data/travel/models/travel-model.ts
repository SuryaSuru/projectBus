import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  travelName: { type: String }
}, { 
  timestamps: true 
});

export const Travel = mongoose.model("Travel", travelSchema);