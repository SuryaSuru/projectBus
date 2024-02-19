import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { BusRepository } from "@domain/bus/repositories/bus-repository"; 
import { BusDataSource } from "@data/bus/datasource/bus-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class BusRepositoryImpl implements BusRepository {
  private readonly dataSource: BusDataSource;

  constructor(dataSource: BusDataSource) {
    this.dataSource = dataSource;
  }

  async createBus(bus: BusModel): Promise<Either<ErrorClass, BusEntity>> {
    // return await this.dataSource.create(bus);
    try {
      let i = await this.dataSource.create(bus);
      return Right<ErrorClass, BusEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "busNumber_conflict"){
        return Left<ErrorClass, BusEntity>(ApiError.busNumberExits());
      }
      return Left<ErrorClass, BusEntity>(ApiError.badRequest());
    }
  }

  async deleteBus(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateBus(id: string, data: BusModel): Promise<Either<ErrorClass, BusEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, BusEntity>(i);
    } catch {
      return Left<ErrorClass, BusEntity>(ApiError.badRequest());
    }
  }

  async getbuses(): Promise<Either<ErrorClass, BusEntity[]>> {
    // return await this.dataSource.getAllbuses();
    try {
      let i = await this.dataSource.getAllbuses();
      return Right<ErrorClass, BusEntity[]>(i);
    } catch {
      return Left<ErrorClass, BusEntity[]>(ApiError.badRequest());
    }
  }

  async getBusById(id: string): Promise<Either<ErrorClass, BusEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, BusEntity | null>(i);
    } catch {
      return Left<ErrorClass, BusEntity | null>(ApiError.badRequest());
    }
  }
}
