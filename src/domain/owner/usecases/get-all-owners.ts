import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { OwnerRepository } from "@domain/owner/repositories/owner-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllOwnersUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, OwnerEntity[]>>;
}

export class GetAllOwners implements GetAllOwnersUsecase {
  private readonly ownerRepository: OwnerRepository;

  constructor(ownerRepository: OwnerRepository) {
    this.ownerRepository = ownerRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, OwnerEntity[]>> {
    return await this.ownerRepository.getOwners(query);
  }
}
