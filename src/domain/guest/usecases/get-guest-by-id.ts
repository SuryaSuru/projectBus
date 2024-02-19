import { GuestModel, GuestEntity } from "@domain/guest/entities/guest";
import { GuestRepository } from "@domain/guest/repositories/guest-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetGuestByIdUsecase {
  execute: (guestId: string) => Promise<Either<ErrorClass, GuestEntity | null>>;
}

export class GetGuestById implements GetGuestByIdUsecase {
  private readonly guestRepository: GuestRepository;

  constructor(guestRepository: GuestRepository) {
    this.guestRepository = guestRepository;
  }

  async execute(guestId: string): Promise<Either<ErrorClass, GuestEntity | null>> {
    return await this.guestRepository.getGuestById(guestId);
  }
}
