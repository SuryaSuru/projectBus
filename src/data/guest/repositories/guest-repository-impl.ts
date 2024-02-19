import { GuestModel, GuestEntity } from "@domain/guest/entities/guest";
import { GuestRepository } from "@domain/guest/repositories/guest-repository"; 
import { GuestDataSource } from "@data/guest/datasource/guest-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class GuestRepositoryImpl implements GuestRepository {
  private readonly dataSource: GuestDataSource;

  constructor(dataSource: GuestDataSource) {
    this.dataSource = dataSource;
  }

  async createGuest(guest: GuestModel): Promise<Either<ErrorClass, GuestEntity>> {
    // return await this.dataSource.create(guest);
    try {
      let i = await this.dataSource.create(guest);
      return Right<ErrorClass, GuestEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "contactInfo_conflict"){
        return Left<ErrorClass, GuestEntity>(ApiError.contactInfoExits());
      }
      return Left<ErrorClass, GuestEntity>(ApiError.badRequest());
    }
  }

  async deleteGuest(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateGuest(id: string, data: GuestModel): Promise<Either<ErrorClass, GuestEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, GuestEntity>(i);
    } catch {
      return Left<ErrorClass, GuestEntity>(ApiError.badRequest());
    }
  }

  async getGuests(): Promise<Either<ErrorClass, GuestEntity[]>> {
    // return await this.dataSource.getAllGuests();
    try {
      let i = await this.dataSource.getAllGuests();
      return Right<ErrorClass, GuestEntity[]>(i);
    } catch {
      return Left<ErrorClass, GuestEntity[]>(ApiError.badRequest());
    }
  }

  async getGuestById(id: string): Promise<Either<ErrorClass, GuestEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, GuestEntity | null>(i);
    } catch {
      return Left<ErrorClass, GuestEntity | null>(ApiError.badRequest());
    }
  }
}
