import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { OwnerRepository } from "@domain/owner/repositories/owner-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetOwnerByIdUsecase {
  execute: (ownerId: string) => Promise<Either<ErrorClass, OwnerEntity | null>>;
}

export class GetOwnerById implements GetOwnerByIdUsecase {
  private readonly ownerRepository: OwnerRepository;

  constructor(ownerRepository: OwnerRepository) {
    this.ownerRepository = ownerRepository;
  }

  async execute(ownerId: string): Promise<Either<ErrorClass, OwnerEntity | null>> {
    return await this.ownerRepository.getOwnerById(ownerId);
  }
}
