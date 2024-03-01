import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { BookingRepository } from "@domain/booking/repositories/booking-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateBookingUsecase {
  execute: (
    bookingId: string,
    bookingData: BookingModel
  ) => Promise<Either<ErrorClass, BookingEntity>>;
}

export class UpdateBooking implements UpdateBookingUsecase {
  private readonly bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }
  async execute(bookingId: string, bookingData: BookingModel): Promise<Either<ErrorClass, BookingEntity>> {
   return await this.bookingRepository.updateBooking(bookingId, bookingData);
 }
}
