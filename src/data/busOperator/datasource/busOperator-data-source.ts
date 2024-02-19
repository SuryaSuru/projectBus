import { BusOperatorModel } from "@domain/busOperator/entities/busOperator";
import { BusOperator } from "../models/busOperator-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface BusOperatorDataSource {
  create(busOperator: BusOperatorModel): Promise<any>; // Return type should be Promise of BusOperatorEntity
  update(id: string, busOperator: BusOperatorModel): Promise<any>; // Return type should be Promise of BusOperatorEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of BusOperatorEntity or null
  getAllBusOperators(): Promise<any[]>; // Return type should be Promise of an array of BusOperatorEntity
}

export class BusOperatorDataSourceImpl implements BusOperatorDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(busOperator: BusOperatorModel): Promise<any> {

      const existingBusOperator = await BusOperator.findOne({ contactInfo: busOperator.contactInfo });
      if (existingBusOperator) {
        throw ApiError.contactInfoExits()
      }

      const busOperatorData = new BusOperator(busOperator);

      const createdBusOperator = await busOperatorData.save();

      return createdBusOperator.toObject();
    }

  async update(id: string, busOperator: BusOperatorModel): Promise<any> {
    const updatedBusOperator = await BusOperator.findByIdAndUpdate(id, busOperator, {
      new: true,
    }); // No need for conversion here
    return updatedBusOperator ? updatedBusOperator.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await BusOperator.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const busOperator = await BusOperator.findById(id);
    return busOperator ? busOperator.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllBusOperators(): Promise<any[]> {
    const busOperators = await BusOperator.find();
    return busOperators.map((busOperator) => busOperator.toObject());
  }
}

