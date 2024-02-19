import { OwnerModel, OwnerEntity } from "@domain/owner/entities/owner";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface OwnerRepository {
  createOwner(Owner: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>>;
  deleteOwner(id: string): Promise<Either<ErrorClass, void>>;
  updateOwner(id: string, data: OwnerModel): Promise<Either<ErrorClass, OwnerEntity>>;
  getOwners(query: object): Promise<Either<ErrorClass, OwnerEntity[]>>;
  getOwnerById(id: string): Promise<Either<ErrorClass, OwnerEntity | null>>;
}

