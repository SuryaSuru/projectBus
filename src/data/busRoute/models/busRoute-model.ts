import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema({
  sourceLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  distance: { type: Number, required: true },
  estimatedDuration: { type: Date }, // Note: Time is not directly supported in Mongoose, you can use Date type
  price: { type: Number, required: true },
  routeStatus: { type: String, enum: ['Active', 'Inactive'], required: true },
  currentLocation: { type: String },
  disabled: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const BusRoute = mongoose.model("BusRoute", busRouteSchema);