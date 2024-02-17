import {type OwnerRepository } from "@domain/owner/repositories/owner-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteOwnerUsecase {
  execute: (ownerId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteOwner implements DeleteOwnerUsecase {
  private readonly ownerRepository: OwnerRepository;

  constructor(ownerRepository: OwnerRepository) {
    this.ownerRepository = ownerRepository;
  }

  async execute(ownerId: string): Promise<Either<ErrorClass, void>> {
    return await this.ownerRepository.deleteOwner(ownerId);
  }
}
