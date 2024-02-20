import { BusModel } from "@domain/bus/entities/bus";
import { Bus } from "../models/bus-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface BusDataSource {
  create(bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  update(id: string, bus: BusModel): Promise<any>; // Return type should be Promise of BusEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusEntity or null
  getAllbuses(query: BusQuery): Promise<any[]>; // Return type should be Promise of an array of BusEntity
}

export interface BusQuery {
  search?: string; // Change ownerId to search
}

export class BusDataSourceImpl implements BusDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(bus: BusModel): Promise<any> {

      const existingBus = await Bus.findOne({ busNumber: bus.busNumber });
      if (existingBus) {
        throw ApiError.busNumberExits()
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

  async getAllbuses(query: BusQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { busNumber: searchRegex },
        { busStatus: searchRegex }
      ];
    }

    const buses = await Bus.find(filter);
    return buses.map((bus) => bus.toObject());
  }
}

