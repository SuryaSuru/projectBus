import { BookingModel, BookingEntity } from "@domain/booking/entities/booking";
import { BookingRepository } from "@domain/booking/repositories/booking-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllbookingesUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, BookingEntity[]>>;
}

export class GetAllbookinges implements GetAllbookingesUsecase {
  private readonly bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, BookingEntity[]>> {
    return await this.bookingRepository.getbookinges(query);
  }
}
