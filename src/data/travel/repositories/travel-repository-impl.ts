import { TravelModel, TravelEntity } from "@domain/travel/entities/travel";
import { TravelRepository } from "@domain/travel/repositories/travel-repository"; 
import { TravelDataSource } from "@data/travel/datasource/travel-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class TravelRepositoryImpl implements TravelRepository {
  private readonly dataSource: TravelDataSource;

  constructor(dataSource: TravelDataSource) {
    this.dataSource = dataSource;
  }

  async createTravel(travel: TravelModel): Promise<Either<ErrorClass, TravelEntity>> {
    // return await this.dataSource.create(travel);
    try {
      let i = await this.dataSource.create(travel);
      return Right<ErrorClass, TravelEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "name_conflict"){
        return Left<ErrorClass, TravelEntity>(ApiError.nameExits());
      }
      return Left<ErrorClass, TravelEntity>(ApiError.badRequest());
    }
  }

  async deleteTravel(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateTravel(id: string, data: TravelModel): Promise<Either<ErrorClass, TravelEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, TravelEntity>(i);
    } catch {
      return Left<ErrorClass, TravelEntity>(ApiError.badRequest());
    }
  }

  async getTravels(): Promise<Either<ErrorClass, TravelEntity[]>> {
    // return await this.dataSource.getAllTravels();
    try {
      let i = await this.dataSource.getAllTravels();
      return Right<ErrorClass, TravelEntity[]>(i);
    } catch {
      return Left<ErrorClass, TravelEntity[]>(ApiError.badRequest());
    }
  }

  async getTravelById(id: string): Promise<Either<ErrorClass, TravelEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, TravelEntity | null>(i);
    } catch {
      return Left<ErrorClass, TravelEntity | null>(ApiError.badRequest());
    }
  }
}
