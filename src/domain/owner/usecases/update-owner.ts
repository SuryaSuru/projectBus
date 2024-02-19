import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { OwnerRepository } from "@domain/owner/repositories/owner-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateOwnerUsecase {
  execute: (
    ownerId: string,
    ownerData: OwnerModel
  ) => Promise<Either<ErrorClass, OwnerEntity>>;
}

export class UpdateOwner implements UpdateOwnerUsecase {
  private readonly ownerRepository: OwnerRepository;

  constructor(ownerRepository: OwnerRepository) {
    this.ownerRepository = ownerRepository;
  }
  async execute(ownerId: string, ownerData: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>> {
   return await this.ownerRepository.updateOwner(ownerId, ownerData);
 }
}
