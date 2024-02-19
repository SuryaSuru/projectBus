import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { OwnerRepository } from "@domain/owner/repositories/owner-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateOwnerUsecase {
  execute: (ownerData: OwnerModel) => Promise<Either<ErrorClass, OwnerEntity>>;
}

export class CreateOwner implements CreateOwnerUsecase {
  private readonly ownerRepository: OwnerRepository;

  constructor(ownerRepository: OwnerRepository) {
    this.ownerRepository = ownerRepository;
  }

  async execute(ownerData: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>> {
    return await this.ownerRepository.createOwner(ownerData);
  }
}
