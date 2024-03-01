import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { BookingRepository } from "@domain/booking/repositories/booking-repository"; 
import { BookingDataSource, BookingQuery } from "@data/booking/datasource/booking-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class BookingRepositoryImpl implements BookingRepository {
  private readonly dataSource: BookingDataSource;

  constructor(dataSource: BookingDataSource) {
    this.dataSource = dataSource;
  }

  async createBooking(booking: BookingModel): Promise<Either<ErrorClass, BookingEntity>> {
    // return await this.dataSource.create(booking);
    try {
      let i = await this.dataSource.create(booking);
      return Right<ErrorClass, BookingEntity>(i);
    } catch (e) {
      // if(e instanceof ApiError && e.name === "bookingNumber_conflict"){
      //   return Left<ErrorClass, BookingEntity>(ApiError.bookingNumberExits());
      // }
      return Left<ErrorClass, BookingEntity>(ApiError.badRequest());
    }
  }

  async deleteBooking(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateBooking(id: string, data: BookingModel): Promise<Either<ErrorClass, BookingEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, BookingEntity>(i);
    } catch {
      return Left<ErrorClass, BookingEntity>(ApiError.badRequest());
    }
  }

  async getbookinges(query: BookingQuery): Promise<Either<ErrorClass, BookingEntity[]>> {
    // return await this.dataSource.getAllbookinges();
    try {
      let i = await this.dataSource.getAllbookinges(query);
      return Right<ErrorClass, BookingEntity[]>(i);
    } catch {
      return Left<ErrorClass, BookingEntity[]>(ApiError.badRequest());
    }
  }

  async getBookingById(id: string): Promise<Either<ErrorClass, BookingEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, BookingEntity | null>(i);
    } catch {
      return Left<ErrorClass, BookingEntity | null>(ApiError.badRequest());
    }
  }
}
