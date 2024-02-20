import { BusRouteModel, BusRouteEntity } from "@domain/busRoute/entities/busRoute";
import { BusRouteRepository } from "@domain/busRoute/repositories/busRoute-repository"; 
import { BusRouteDataSource, BusRouteQuery } from "@data/busRoute/datasource/busRoute-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class BusRouteRepositoryImpl implements BusRouteRepository {
  private readonly dataSource: BusRouteDataSource;

  constructor(dataSource: BusRouteDataSource) {
    this.dataSource = dataSource;
  }

  async createBusRoute(busRoute: BusRouteModel): Promise<Either<ErrorClass, BusRouteEntity>> {
    // return await this.dataSource.create(busRoute);
    try {
      let i = await this.dataSource.create(busRoute);
      return Right<ErrorClass, BusRouteEntity>(i);
    } catch (e) {
      // if(e instanceof ApiError && e.name === "email_conflict"){
      //   return Left<ErrorClass, BusRouteEntity>(ApiError.emailExits());
      // }
      return Left<ErrorClass, BusRouteEntity>(ApiError.badRequest());
    }
  }

  async deleteBusRoute(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateBusRoute(id: string, data: BusRouteModel): Promise<Either<ErrorClass, BusRouteEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, BusRouteEntity>(i);
    } catch {
      return Left<ErrorClass, BusRouteEntity>(ApiError.badRequest());
    }
  }

  async getBusRoutes(query: BusRouteQuery): Promise<Either<ErrorClass, BusRouteEntity[]>> {
    // return await this.dataSource.getAllBusRoutes();
    try {
      let i = await this.dataSource.getAllBusRoutes(query);
      return Right<ErrorClass, BusRouteEntity[]>(i);
    } catch {
      return Left<ErrorClass, BusRouteEntity[]>(ApiError.badRequest());
    }
  }

  async getBusRouteById(id: string): Promise<Either<ErrorClass, BusRouteEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, BusRouteEntity | null>(i);
    } catch {
      return Left<ErrorClass, BusRouteEntity | null>(ApiError.badRequest());
    }
  }
}
