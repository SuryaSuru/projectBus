import mongoose from "mongoose";

const busOperatorSchema = new mongoose.Schema({
  busOperatorId: { type: String },
  operatorName: { type: String },
  contactInfo: { type: String },
  address: { type: String },
  disabled: { type: Boolean, default: false }
}, { timestamps: true });

busOperatorSchema.pre('save', function (next) {
  if (!this.busOperatorId) {
    // Generate userId if not provided
    this.busOperatorId = generateBusOperatorId();
  }
  next();
});

function generateBusOperatorId() {
  // Generate random 6-digit alphanumeric string starting with "USE"
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "OPE" + randomId;
}

export const BusOperator = mongoose.model("BusOperator", busOperatorSchema);