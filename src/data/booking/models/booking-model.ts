import mongoose from "mongoose";

const bookingeschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusSchedule', required: true },
  seatNumber: [{ type: String }],
  bookingDate: { type: Date, default: Date.now },
  totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], required: true }
}, {
  timestamps: true
});

export const Booking = mongoose.model("Booking", bookingeschema);