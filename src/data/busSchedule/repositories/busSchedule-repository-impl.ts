import { BusScheduleModel, BusScheduleEntity } from "@domain/busSchedule/entities/busSchedule";
import { BusScheduleRepository } from "@domain/busSchedule/repositories/busSchedule-repository"; 
import { BusScheduleDataSource } from "@data/busSchedule/datasource/busSchedule-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class BusScheduleRepositoryImpl implements BusScheduleRepository {
  private readonly dataSource: BusScheduleDataSource;

  constructor(dataSource: BusScheduleDataSource) {
    this.dataSource = dataSource;
  }

  async createBusSchedule(busSchedule: BusScheduleModel): Promise<Either<ErrorClass, BusScheduleEntity>> {
    // return await this.dataSource.create(busSchedule);
    try {
      let i = await this.dataSource.create(busSchedule);
      return Right<ErrorClass, BusScheduleEntity>(i);
    } catch (e) {
      // if(e instanceof ApiError && e.name === "contactInfo_conflict"){
      //   return Left<ErrorClass, BusScheduleEntity>(ApiError.contactInfoExits());
      // }
      return Left<ErrorClass, BusScheduleEntity>(ApiError.badRequest());
    }
  }

  async deleteBusSchedule(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateBusSchedule(id: string, data: BusScheduleModel): Promise<Either<ErrorClass, BusScheduleEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, BusScheduleEntity>(i);
    } catch {
      return Left<ErrorClass, BusScheduleEntity>(ApiError.badRequest());
    }
  }

  async getBusSchedules(): Promise<Either<ErrorClass, BusScheduleEntity[]>> {
    // return await this.dataSource.getAllBusSchedules();
    try {
      let i = await this.dataSource.getAllBusSchedules();
      return Right<ErrorClass, BusScheduleEntity[]>(i);
    } catch {
      return Left<ErrorClass, BusScheduleEntity[]>(ApiError.badRequest());
    }
  }

  async getBusScheduleById(id: string): Promise<Either<ErrorClass, BusScheduleEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, BusScheduleEntity | null>(i);
    } catch {
      return Left<ErrorClass, BusScheduleEntity | null>(ApiError.badRequest());
    }
  }
}
