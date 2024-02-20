import { TravelModel } from "@domain/travel/entities/travel";
import { Travel } from "../models/travel-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface TravelDataSource {
  create(travel: TravelModel): Promise<any>; // Return type should be Promise of TravelEntity
  update(id: string, travel: TravelModel): Promise<any>; // Return type should be Promise of TravelEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of TravelEntity or null
  getAllTravels(query: TravelQuery): Promise<any[]>; // Return type should be Promise of an array of TravelEntity
}

export interface TravelQuery {
  search?: string; // Change ownerId to search
}

export class TravelDataSourceImpl implements TravelDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(travel: TravelModel): Promise<any> {

      const existingTravel = await Travel.findOne({ travelName: travel.travelName });
      if (existingTravel) {
        throw ApiError.nameExits()
      }

      const travelData = new Travel(travel);

      const createdTravel = await travelData.save();

      return createdTravel.toObject();
    }

  async update(id: string, travel: TravelModel): Promise<any> {
    const updatedTravel = await Travel.findByIdAndUpdate(id, travel, {
      new: true,
    }); // No need for conversion here
    return updatedTravel ? updatedTravel.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Travel.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const travel = await Travel.findById(id);
    return travel ? travel.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllTravels(query: TravelQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { travelName: searchRegex }
      ];
    }

    const travels = await Travel.find(filter);
    return travels.map((travel) => travel.toObject());
  }
}

