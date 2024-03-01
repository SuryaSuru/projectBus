import { GuestModel } from "@domain/guest/entities/guest";
import { Guest } from "../models/guest-model";
import mongoose from "mongoose";
import twilio  from "twilio";
import ApiError from "@presentation/error-handling/api-error";

// Initialize Twilio client with your Twilio account SID and auth token
const client = twilio('AC3431a5fda4518ffeb74027189c5cff2c', '3b6ed499832cffb21511acc055710ae4');

export interface GuestDataSource {
  create(guest: GuestModel): Promise<any>; // Return type should be Promise of GuestEntity
  update(id: string, guest: GuestModel): Promise<any>; // Return type should be Promise of GuestEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of GuestEntity or null
  getAllGuests(): Promise<any[]>; // Return type should be Promise of an array of GuestEntity
}

export class GuestDataSourceImpl implements GuestDataSource {
  constructor(private db: mongoose.Connection) { }

  async create(guest: GuestModel): Promise<any> {
    const existingGuest = await Guest.findOne({ contactInfo: guest.contactInfo });
    if (existingGuest) {
      throw ApiError.contactInfoExits()
    }

    const guestData = new Guest(guest);

    const createdGuest = await guestData.save();
    console.log("createdGuest", createdGuest);
    

    // Sending OTP via Twilio after successful guest creation
    await this.sendOTP(guest.contactInfo, '1234'); // You can generate OTP dynamically

    return createdGuest.toObject();
  }

  // Function to send OTP via SMS using Twilio
  async sendOTP(contactInfo: string, otp: string) {
    try {
      // Send SMS message using Twilio API
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        to: contactInfo, // Receiver's phone number
        from: '+13203217613' // Your Twilio phone number
      });
      console.log("otp", otp);
      console.log('OTP sent successfully');
    } catch (error) {
      throw new Error('Failed to send OTP via Twilio');
    }
  }

  async update(id: string, guest: GuestModel): Promise<any> {
    const updatedGuest = await Guest.findByIdAndUpdate(id, guest, {
      new: true,
    }); // No need for conversion here
    return updatedGuest ? updatedGuest.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Guest.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const guest = await Guest.findById(id);
    return guest ? guest.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllGuests(): Promise<any[]> {
    const guests = await Guest.find();
    return guests.map((guest) => guest.toObject());
  }
}

