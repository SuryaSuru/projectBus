import { BusRouteModel } from "@domain/busRoute/entities/busRoute";
import { Bus } from "@data/bus/models/bus-model";
import { BusSchedule } from "@data/busSchedule/models/busSchedule-model";
import { BusRoute } from "../models/busRoute-model";
import mongoose from "mongoose";
import { CronJob } from 'cron';
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
  constructor(private db: mongoose.Connection) {
    const job = new CronJob('0 */2 * * *', async () => {
    // const job = new CronJob('*/2 * * * *', async () => {
      // Perform update logic here
      const busRoutes = await BusRoute.find({});
      for (const busRoute of busRoutes) {
        if (busRoute.currentLocation === busRoute.destinationLocation) {
          const busSchedules = await BusSchedule.find({ routeId: busRoute._id });
          for (const schedule of busSchedules) {
            await Bus.updateOne(
              { _id: schedule.busId },
              { $set: { bookedSeats: [], soldSeats: [] } }
            );
          }
        }
      }
    });
    job.start();
   }

    async create(busRoute: BusRouteModel): Promise<any> {

      const busRouteData = new BusRoute(busRoute);

      const createdBusRoute = await busRouteData.save();

      return createdBusRoute.toObject();
    }

  // async update(id: string, busRoute: BusRouteModel): Promise<any> {
  //   const updatedBusRoute = await BusRoute.findByIdAndUpdate(id, busRoute, {
  //     new: true,
  //   }); // No need for conversion here
  //   return updatedBusRoute ? updatedBusRoute.toObject() : null; // Convert to plain JavaScript object before returning
  // }

  async update(id: string, busRoute: BusRouteModel): Promise<any> {
    const updatedBusRoute = await BusRoute.findByIdAndUpdate(id, busRoute, {
      new: true,
    });

    if (!updatedBusRoute) {
      return null;
    }

    return updatedBusRoute.toObject();
  }

  // async update(id: string, busRoute: BusRouteModel): Promise<any> {
  //   const updatedBusRoute = await BusRoute.findByIdAndUpdate(id, busRoute, {
  //     new: true,
  //   });
  
  //   if (!updatedBusRoute) {
  //     return null;
  //   }
  
  //   // Check if currentLocation matches destinationLocation
  //   if (updatedBusRoute.currentLocation === updatedBusRoute.destinationLocation) {
  //     // Find all bus schedules associated with this bus route
  //     const busSchedules = await BusSchedule.find({ routeId: id });
  
  //     // Iterate over each bus schedule and clear bookedSeats and soldSeats of corresponding buses
  //     for (const schedule of busSchedules) {
  //       await Bus.updateOne(
  //         { _id: schedule.busId },
  //         { $set: { bookedSeats: [], soldSeats: [] } }
  //       );
  //     }
  //   }
  
  //   return updatedBusRoute.toObject();
  // }
  
  

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

