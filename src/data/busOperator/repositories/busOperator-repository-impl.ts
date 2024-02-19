import { BusOperatorModel, BusOperatorEntity } from "@domain/busOperator/entities/busOperator";
import { BusOperatorRepository } from "@domain/busOperator/repositories/busOperator-repository"; 
import { BusOperatorDataSource } from "@data/busOperator/datasource/busOperator-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class BusOperatorRepositoryImpl implements BusOperatorRepository {
  private readonly dataSource: BusOperatorDataSource;

  constructor(dataSource: BusOperatorDataSource) {
    this.dataSource = dataSource;
  }

  async createBusOperator(busOperator: BusOperatorModel): Promise<Either<ErrorClass, BusOperatorEntity>> {
    // return await this.dataSource.create(busOperator);
    try {
      let i = await this.dataSource.create(busOperator);
      return Right<ErrorClass, BusOperatorEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "contactInfo_conflict"){
        return Left<ErrorClass, BusOperatorEntity>(ApiError.contactInfoExits());
      }
      return Left<ErrorClass, BusOperatorEntity>(ApiError.badRequest());
    }
  }

  async deleteBusOperator(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateBusOperator(id: string, data: BusOperatorModel): Promise<Either<ErrorClass, BusOperatorEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, BusOperatorEntity>(i);
    } catch {
      return Left<ErrorClass, BusOperatorEntity>(ApiError.badRequest());
    }
  }

  async getBusOperators(): Promise<Either<ErrorClass, BusOperatorEntity[]>> {
    // return await this.dataSource.getAllBusOperators();
    try {
      let i = await this.dataSource.getAllBusOperators();
      return Right<ErrorClass, BusOperatorEntity[]>(i);
    } catch {
      return Left<ErrorClass, BusOperatorEntity[]>(ApiError.badRequest());
    }
  }

  async getBusOperatorById(id: string): Promise<Either<ErrorClass, BusOperatorEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, BusOperatorEntity | null>(i);
    } catch {
      return Left<ErrorClass, BusOperatorEntity | null>(ApiError.badRequest());
    }
  }
}
