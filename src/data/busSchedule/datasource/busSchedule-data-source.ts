import { BusScheduleModel } from "@domain/busSchedule/entities/busSchedule";
import { BusSchedule } from "../models/busSchedule-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface BusScheduleDataSource {
  create(busSchedule: BusScheduleModel): Promise<any>; // Return type should be Promise of BusScheduleEntity
  update(id: string, busSchedule: BusScheduleModel): Promise<any>; // Return type should be Promise of BusScheduleEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusScheduleEntity or null
  getAllBusSchedules(query: BusScheduleQuery): Promise<any[]>; // Return type should be Promise of an array of BusScheduleEntity
}

export interface BusScheduleQuery {
  search?: string; // Change ownerId to search
}

export class BusScheduleDataSourceImpl implements BusScheduleDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(busSchedule: BusScheduleModel): Promise<any> {

      // const existingBusSchedule = await BusSchedule.findOne({ contactInfo: busSchedule.contactInfo });
      // if (existingBusSchedule) {
      //   throw ApiError.contactInfoExits()
      // }

      const busScheduleData = new BusSchedule(busSchedule);

      const createdBusSchedule = await busScheduleData.save();

      return createdBusSchedule.toObject();
    }

  async update(id: string, busSchedule: BusScheduleModel): Promise<any> {
    const updatedBusSchedule = await BusSchedule.findByIdAndUpdate(id, busSchedule, {
      new: true,
    }); // No need for conversion here
    return updatedBusSchedule ? updatedBusSchedule.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await BusSchedule.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const busSchedule = await BusSchedule.findById(id);
    return busSchedule ? busSchedule.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllBusSchedules(query: BusScheduleQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { boardingPoints: searchRegex },
        { droppingPoints: searchRegex },
        { scheduleStatus: searchRegex }
      ];
    }

    const busSchedules = await BusSchedule.find(filter);
    return busSchedules.map((busSchedule) => busSchedule.toObject());
  }
}

