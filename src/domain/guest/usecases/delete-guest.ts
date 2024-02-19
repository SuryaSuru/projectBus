import {type GuestRepository } from "@domain/guest/repositories/guest-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteGuestUsecase {
  execute: (guestId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteGuest implements DeleteGuestUsecase {
  private readonly guestRepository: GuestRepository;

  constructor(guestRepository: GuestRepository) {
    this.guestRepository = guestRepository;
  }

  async execute(guestId: string): Promise<Either<ErrorClass, void>> {
    return await this.guestRepository.deleteGuest(guestId);
  }
}
