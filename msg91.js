import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
import { OwnerModel } from "@domain/owner/entities/owner";
import { Owner } from "../models/owner-model";
import msg91 from "msg91";

const msg91authkey = process.env.SENDER_AUTH;
const msg91sender = process.env.SENDER_ID;
const msg91route = process.env.SENDER_ROUTE; // Route number 4 represents Transactional route

// Initialize msg91
const msg91sms = msg91(msg91authkey, msg91sender, msg91route);

export interface OwnerDataSource {
  create(owner: OwnerModel): Promise<any>; // Return type should be Promise of OwnerEntity
  update(id: string, owner: OwnerModel): Promise<any>; // Return type should be Promise of OwnerEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of OwnerEntity or null
  getAllOwners(): Promise<any[]>; // Return type should be Promise of an array of OwnerEntity
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

export class OwnerDataSourceImpl implements OwnerDataSource {
  constructor(private db: mongoose.Connection) { }
  
  async create(owner: OwnerModel): Promise<any> {
    const existingOwner = await Owner.findOne({ contactInfo: owner.contactInfo });
    if (existingOwner) {
        throw ApiError.contactInfoExits();
    }

    const ownerData = new Owner(owner);
    const createdOwner = await ownerData.save();

    // Generate OTP (You can use any logic to generate OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Send OTP via SMS
    const message = `Your OTP for verification is: ${otp}`;
    const mobileNumber = owner.contactInfo; // Use owner.contactInfo for sending OTP

    try {
      await sendOTP(mobileNumber, message); // Wait for OTP sending
    } catch (error) {
      // Handle error when sending OTP
      console.error("Error sending OTP:", error);
      // You might want to rollback the owner creation here
      // throw ApiError.internalServerError("Error sending OTP");
    }

    return createdOwner.toObject(); // Return created owner after sending OTP
  }
}