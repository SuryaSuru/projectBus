import {type BookingRepository } from "@domain/booking/repositories/booking-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteBookingUsecase {
  execute: (bookingId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBooking implements DeleteBookingUsecase {
  private readonly bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(bookingId: string): Promise<Either<ErrorClass, void>> {
    return await this.bookingRepository.deleteBooking(bookingId);
  }
}
