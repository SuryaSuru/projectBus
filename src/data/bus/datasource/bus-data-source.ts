import { BusModel } from "@domain/bus/entities/bus";
import { Bus } from "../models/bus-model";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface BusDataSource {
  create(bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  update(id: string, bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusEntity or null
  getAllbuses(): Promise<any[]>; // Return type should be Promise of an array of BusEntity
}

export class BusDataSourceImpl implements BusDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(bus: BusModel): Promise<any> {

      const existingBus = await Bus.findOne({ busNumber: bus.busNumber });
      if (existingBus) {
        throw ApiError.emailExits()
      }

      const busData = new Bus(bus);

      const createdBus = await busData.save();

      return createdBus.toObject();
    }

  async update(id: string, bus: BusModel): Promise<any> {
    const updatedBus = await Bus.findByIdAndUpdate(id, bus, {
      new: true,
    }); // No need for conversion here
    return updatedBus ? updatedBus.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Bus.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const bus = await Bus.findById(id);
    return bus ? bus.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllbuses(): Promise<any[]> {
    const buses = await Bus.find();
    return buses.map((bus) => bus.toObject());
  }
}

