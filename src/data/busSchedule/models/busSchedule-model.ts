import mongoose from "mongoose";

const busScheduleSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    departureTime: { type: Date, required: true },
    boardingPoints: [{ type: String }],
    droppingPoints: [{ type: String }],
    arrivalTime: { type: Date },
    journeyDate: { type: Date },
    scheduleStatus: { type: String, enum: ['Scheduled', 'Cancelled'], required: true },
    disabled: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

export const BusSchedule = mongoose.model("BusSchedule", busScheduleSchema);