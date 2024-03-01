import mongoose from "mongoose";

const feedbackeschema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  feedbackDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Feedback = mongoose.model("Feedback", feedbackeschema);