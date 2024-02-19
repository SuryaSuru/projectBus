import { GuestModel, GuestEntity } from "@domain/guest/entities/guest";
import { GuestRepository } from "@domain/guest/repositories/guest-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllGuestsUsecase {
  execute: () => Promise<Either<ErrorClass, GuestEntity[]>>;
}

export class GetAllGuests implements GetAllGuestsUsecase {
  private readonly guestRepository: GuestRepository;

  constructor(guestRepository: GuestRepository) {
    this.guestRepository = guestRepository;
  }

  async execute(): Promise<Either<ErrorClass, GuestEntity[]>> {
    return await this.guestRepository.getGuests();
  }
}
