import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { BookingRepository } from "@domain/booking/repositories/booking-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetBookingByIdUsecase {
  execute: (bookingId: string) => Promise<Either<ErrorClass, BookingEntity | null>>;
}

export class GetBookingById implements GetBookingByIdUsecase {
  private readonly bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(bookingId: string): Promise<Either<ErrorClass, BookingEntity | null>> {
    return await this.bookingRepository.getBookingById(bookingId);
  }
}
