import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface BookingRepository {
  createBooking(Booking: BookingModel): Promise<Either<ErrorClass, BookingEntity>>;
  deleteBooking(id: string): Promise<Either<ErrorClass, void>>;
  updateBooking(id: string, data: BookingModel): Promise<Either<ErrorClass, BookingEntity>>;
  getbookinges(query: object): Promise<Either<ErrorClass, BookingEntity[]>>;
  getBookingById(id: string): Promise<Either<ErrorClass, BookingEntity | null>>;
}

