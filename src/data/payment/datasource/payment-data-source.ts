import { PaymentModel } from "@domain/payment/entities/payment";
import { BusSchedule } from "@data/busSchedule/models/busSchedule-model";
import { Booking } from "@data/booking/models/booking-model";
import { Bus } from "@data/bus/models/bus-model";
import { Payment } from "../models/payment-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface PaymentDataSource {
  create(payment: PaymentModel): Promise<any>; // Return type should be Promise of PaymentEntity
  update(id: string, payment: PaymentModel): Promise<any>; // Return type should be Promise of PaymentEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of PaymentEntity or null
  getAllpaymentes(query: PaymentQuery): Promise<any[]>; // Return type should be Promise of an array of PaymentEntity
}

export interface PaymentQuery {
  search?: string; // Change ownerId to search
}

export class PaymentDataSourceImpl implements PaymentDataSource {
  constructor(private db: mongoose.Connection) { }

    // async create(payment: PaymentModel): Promise<any> {
      
    //   const paymentData = new Payment(payment);

    //   const createdPayment = await paymentData.save();

    //   return createdPayment.toObject();
    // }
    async create(payment: PaymentModel): Promise<any> {
      const paymentData = new Payment(payment);
      const createdPayment = await paymentData.save();
  
      // Update soldSeats in associated bus
      const bookingId = payment.bookingId;
      const booking = await Booking.findById(bookingId);
      if (booking) {
        const scheduleId = booking.scheduleId;
        const busSchedule = await BusSchedule.findById(scheduleId);
        if (busSchedule) {
          const busId = busSchedule.busId;
          const bus = await Bus.findById(busId);
          if (bus) {
            const soldSeats = bus.soldSeats || [];
            const seatNumbers = booking.seatNumber || [];
            soldSeats.push(...seatNumbers);
            bus.soldSeats = soldSeats;
            await bus.save();
          }
        }
      }
  
      return createdPayment.toObject();
    }

  async update(id: string, payment: PaymentModel): Promise<any> {
    const updatedPayment = await Payment.findByIdAndUpdate(id, payment, {
      new: true,
    }); // No need for conversion here
    return updatedPayment ? updatedPayment.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Payment.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const payment = await Payment.findById(id)
      .populate('bookingId') // Populate the 'operatorId' field with data from 'PaymentRoute' collection
  
    return payment ? payment.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllpaymentes(query: PaymentQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { paymentNumber: searchRegex },
        { paymentStatus: searchRegex }
      ];
    }

    const paymentes = await Payment.find(filter);
    return paymentes.map((payment) => payment.toObject());
  }
}

