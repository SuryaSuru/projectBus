import mongoose from "mongoose";

const paymenteschema = new mongoose.Schema({
bookingId: {  type: String, required: true },
amount: { type: Number, required: true },
paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
paymentMethod: { type: String, enum: ['CreditCard', 'DebitCard', 'NetBanking', 'UPI'], required: true },
paymentDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Payment = mongoose.model("Payment", paymenteschema);