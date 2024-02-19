import { GuestModel } from "@domain/guest/entities/guest";
import { Guest } from "../models/guest-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
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

      return createdGuest.toObject();
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

