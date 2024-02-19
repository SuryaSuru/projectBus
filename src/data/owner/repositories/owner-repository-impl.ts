import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { OwnerRepository } from "@domain/owner/repositories/owner-repository"; 
import { OwnerDataSource, OwnerQuery } from "@data/owner/datasource/owner-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class OwnerRepositoryImpl implements OwnerRepository {
  private readonly dataSource: OwnerDataSource;

  constructor(dataSource: OwnerDataSource) {
    this.dataSource = dataSource;
  }

  async createOwner(owner: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>> {
    // return await this.dataSource.create(owner);
    try {
      let i = await this.dataSource.create(owner);
      return Right<ErrorClass, OwnerEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "email_conflict"){
        return Left<ErrorClass, OwnerEntity>(ApiError.emailExits());
      }
      return Left<ErrorClass, OwnerEntity>(ApiError.badRequest());
    }
  }

  async deleteOwner(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateOwner(id: string, data: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, OwnerEntity>(i);
    } catch {
      return Left<ErrorClass, OwnerEntity>(ApiError.badRequest());
    }
  }

  async getOwners(query: OwnerQuery): Promise<Either<ErrorClass, OwnerEntity[]>> {
    // return await this.dataSource.getAllOwners();
    try {
      let i = await this.dataSource.getAllOwners(query);
      return Right<ErrorClass, OwnerEntity[]>(i);
    } catch {
      return Left<ErrorClass, OwnerEntity[]>(ApiError.badRequest());
    }
  }

  async getOwnerById(id: string): Promise<Either<ErrorClass, OwnerEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, OwnerEntity | null>(i);
    } catch {
      return Left<ErrorClass, OwnerEntity | null>(ApiError.badRequest());
    }
  }
}
