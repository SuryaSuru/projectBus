import mongoose from "mongoose";

const buseschema = new mongoose.Schema({
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  busNumber: { type: String, required: true },
  type: { type: String, enum: ['AC', 'Delux', 'Normal', 'Suspense AC', 'Suspense Delux'], required: true },
  capacity: { type: Number, required: true },
  features: [{ type: String }],
  description: { type: String, maxlength: 200 },
  seatsAvailable: { type: Number, required: true },
  bookedSeats: [{ type: String }],
  soldSeats: [{ type: String }],
  image: { type: String, maxlength: 50 },
  fare: { type: mongoose.Schema.Types.Decimal128, required: true },
  registrationDate: { type: Date, default: Date.now },
  busStatus: { type: String, enum: ['Active', 'Inactive'], required: true },
  disabled: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Bus = mongoose.model("Bus", buseschema);