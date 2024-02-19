import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
import { BusModel } from "@domain/bus/entities/bus";
import { Bus } from "../models/bus-model";
import msg91 from "msg91";

const msg91authkey = process.env.SENDER_AUTH;
const msg91sender = process.env.SENDER_ID;
const msg91route = process.env.SENDER_ROUTE; // Route number 4 represents Transactional route

// Initialize msg91
const msg91sms = msg91(msg91authkey, msg91sender, msg91route);

export interface BusDataSource {
  create(bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  update(id: string, bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusEntity or null
  getAllbuses(): Promise<any[]>; // Return type should be Promise of an array of BusEntity
}

// Function to send OTP via SMS
async function sendOTP(contactNumber: string, message: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    msg91sms.send(contactNumber, message, (err: any, response: any) => {
      if (err) {
        reject(err); // Reject with error if sending failed
      } else {
        resolve(); // Resolve if sending successful
      }
    });
  });
}

export class BusDataSourceImpl implements BusDataSource {
  constructor(private db: mongoose.Connection) { }
  
  async create(bus: BusModel): Promise<any> {
    const existingBus = await Bus.findOne({ contactInfo: bus.contactInfo });
    if (existingBus) {
        throw ApiError.contactInfoExits();
    }

    const busData = new Bus(bus);
    const createdBus = await busData.save();

    // Generate OTP (You can use any logic to generate OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Send OTP via SMS
    const message = `Your OTP for verification is: ${otp}`;
    const mobileNumber = bus.contactInfo; // Use bus.contactInfo for sending OTP

    try {
      await sendOTP(mobileNumber, message); // Wait for OTP sending
    } catch (error) {
      // Handle error when sending OTP
      console.error("Error sending OTP:", error);
      // You might want to rollback the bus creation here
      // throw ApiError.internalServerError("Error sending OTP");
    }

    return createdBus.toObject(); // Return created bus after sending OTP
  }
}