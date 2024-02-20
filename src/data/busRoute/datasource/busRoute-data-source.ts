import { BusRouteModel } from "@domain/busRoute/entities/busRoute";
import { BusRoute } from "../models/busRoute-model";
import mongoose from "mongoose";
// import ApiError from "@presentation/error-handling/api-error";
export interface BusRouteDataSource {
  create(busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  update(id: string, busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusRouteEntity or null
  getAllBusRoutes(query: BusRouteQuery): Promise<any[]>; // Return type should be Promise of an array of BusRouteEntity
}

export interface BusRouteQuery {
  search?: string; // Change ownerId to search
}

export class BusRouteDataSourceImpl implements BusRouteDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(busRoute: BusRouteModel): Promise<any> {

      const busRouteData = new BusRoute(busRoute);

      const createdBusRoute = await busRouteData.save();

      return createdBusRoute.toObject();
    }

  async update(id: string, busRoute: BusRouteModel): Promise<any> {
    const updatedBusRoute = await BusRoute.findByIdAndUpdate(id, busRoute, {
      new: true,
    }); // No need for conversion here
    return updatedBusRoute ? updatedBusRoute.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await BusRoute.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const busRoute = await BusRoute.findById(id);
    return busRoute ? busRoute.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllBusRoutes(query: BusRouteQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { routeStatus: searchRegex }
      ];
    }

    const busRoutes = await BusRoute.find(filter);
    return busRoutes.map((busRoute) => busRoute.toObject());
  }
}

