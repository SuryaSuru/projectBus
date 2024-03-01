import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { BookingRepository } from "@domain/booking/repositories/booking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateBookingUsecase {
  execute: (bookingData: BookingModel) => Promise<Either<ErrorClass, BookingEntity>>;
}

export class CreateBooking implements CreateBookingUsecase {
  private readonly bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(bookingData: BookingModel): Promise<Either<ErrorClass, BookingEntity>> {
    return await this.bookingRepository.createBooking(bookingData);
  }
}
