import { BookingModel } from "@domain/booking/entities/booking";
import { BusSchedule } from "@data/busSchedule/models/busSchedule-model";
import { Bus } from "@data/bus/models/bus-model";
import { Booking } from "../models/booking-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface BookingDataSource {
  create(booking: BookingModel): Promise<any>; // Return type should be Promise of BookingEntity
  update(id: string, booking: BookingModel): Promise<any>; // Return type should be Promise of BookingEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BookingEntity or null
  getAllbookinges(query: BookingQuery): Promise<any[]>; // Return type should be Promise of an array of BookingEntity
}

export interface BookingQuery {
  search?: string; // Change ownerId to search
}

export class BookingDataSourceImpl implements BookingDataSource {
  constructor(private db: mongoose.Connection) { }

    // async create(booking: BookingModel): Promise<any> {

    //   // const existingBooking = await Booking.findOne({ bookingNumber: booking.bookingNumber });
    //   // if (existingBooking) {
    //   //   throw ApiError.bookingNumberExits()
    //   // }

    //   const bookingData = new Booking(booking);

    //   const createdBooking = await bookingData.save();

    //   return createdBooking.toObject();
    // }

    async create(booking: BookingModel): Promise<any> {
      const bookingData = new Booking(booking);
      const createdBooking = await bookingData.save();
      console.log("createdBooking--->", createdBooking);
      // Update the bookedSeats field in the corresponding Bus document
      const busSchedule = await BusSchedule.findById(booking.scheduleId);
    
      if (busSchedule) {
        const busId = busSchedule.busId;
        const seatsBooked = booking.seatNumber.length;
    
        await Promise.all([
          BusSchedule.findByIdAndUpdate(
            booking.scheduleId,
            { $push: { bookedSeats: { $each: booking.seatNumber } } },
            { new: true }
          ),
          BookingDataSourceImpl.updateBusSeats(busId, seatsBooked, booking) // Pass the booking object
        ]);
      }
    
      return createdBooking.toObject();
    }
    
  
    private static async updateBusSeats(busId: mongoose.Types.ObjectId, seatsBooked: number, booking: BookingModel): Promise<void> {
      const bus = await Bus.findById(busId);
    
      if (bus) {
        bus.seatsAvailable -= seatsBooked;
        bus.bookedSeats.push(...booking.seatNumber); // Update bookedSeats array with booking.seatNumber
        await bus.save();
      }
    }
    

  async update(id: string, booking: BookingModel): Promise<any> {
    const updatedBooking = await Booking.findByIdAndUpdate(id, booking, {
      new: true,
    }); // No need for conversion here
    return updatedBooking ? updatedBooking.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Booking.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const booking = await Booking.findById(id)
      .populate('userId') // Populate the 'operatorId' field with data from 'BookingRoute' collection
      .populate({
        path: 'scheduleId',
        populate: {
          path: 'busId'
        }
      });   // Populate the 'ownerId' field with data from 'Owner' collection
  
    return booking ? booking.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllbookinges(query: BookingQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { bookingNumber: searchRegex },
        { bookingStatus: searchRegex }
      ];
    }

    const bookinges = await Booking.find(filter);
    return bookinges.map((booking) => booking.toObject());
  }
}

