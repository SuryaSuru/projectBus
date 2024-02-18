import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
import { BusRouteModel } from "@domain/busRoute/entities/busRoute";
import { BusRoute } from "../models/busRoute-model";
import msg91 from "msg91";

const msg91authkey = process.env.SENDER_AUTH;
const msg91sender = process.env.SENDER_ID;
const msg91route = process.env.SENDER_ROUTE; // Route number 4 represents Transactional route

// Initialize msg91
const msg91sms = msg91(msg91authkey, msg91sender, msg91route);

export interface BusRouteDataSource {
  create(busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  update(id: string, busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusRouteEntity or null
  getAllBusRoutes(): Promise<any[]>; // Return type should be Promise of an array of BusRouteEntity
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

export class BusRouteDataSourceImpl implements BusRouteDataSource {
  constructor(private db: mongoose.Connection) { }
  
  async create(busRoute: BusRouteModel): Promise<any> {
    const existingBusRoute = await BusRoute.findOne({ contactInfo: busRoute.contactInfo });
    if (existingBusRoute) {
        throw ApiError.contactInfoExits();
    }

    const busRouteData = new BusRoute(busRoute);
    const createdBusRoute = await busRouteData.save();

    // Generate OTP (You can use any logic to generate OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Send OTP via SMS
    const message = `Your OTP for verification is: ${otp}`;
    const mobileNumber = busRoute.contactInfo; // Use busRoute.contactInfo for sending OTP

    try {
      await sendOTP(mobileNumber, message); // Wait for OTP sending
    } catch (error) {
      // Handle error when sending OTP
      console.error("Error sending OTP:", error);
      // You might want to rollback the busRoute creation here
      // throw ApiError.internalServerError("Error sending OTP");
    }

    return createdBusRoute.toObject(); // Return created busRoute after sending OTP
  }
}