import { BusRouteModel } from "@domain/busRoute/entities/busRoute";
import { BusRoute } from "../models/busRoute-model";
import mongoose from "mongoose";
// import ApiError from "@presentation/error-handling/api-error";
export interface BusRouteDataSource {
  create(busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  update(id: string, busRoute: BusRouteModel): Promise<any>; // Return type should be Promise of BusRouteEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusRouteEntity or null
  getAllBusRoutes(): Promise<any[]>; // Return type should be Promise of an array of BusRouteEntity
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

  async getAllBusRoutes(): Promise<any[]> {
    const busRoutes = await BusRoute.find();
    return busRoutes.map((busRoute) => busRoute.toObject());
  }
}

