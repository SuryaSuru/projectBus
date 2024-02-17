import { NextFunction, Request, Response } from "express";
import {
  OwnerModel,
  OwnerEntity,
  OwnerMapper,
} from "@domain/owner/entities/owner";
import { CreateOwnerUsecase } from "@domain/owner/usecases/create-owner";
import { DeleteOwnerUsecase } from "@domain/owner/usecases/delete-owner";
import { GetOwnerByIdUsecase } from "@domain/owner/usecases/get-owner-by-id";
import { UpdateOwnerUsecase } from "@domain/owner/usecases/update-owner";
import { GetAllOwnersUsecase } from "@domain/owner/usecases/get-all-owners";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class OwnerService {
  private readonly createOwnerUsecase: CreateOwnerUsecase;
  private readonly deleteOwnerUsecase: DeleteOwnerUsecase;
  private readonly getOwnerByIdUsecase: GetOwnerByIdUsecase;
  private readonly updateOwnerUsecase: UpdateOwnerUsecase;
  private readonly getAllOwnersUsecase: GetAllOwnersUsecase;

  constructor(
    createOwnerUsecase: CreateOwnerUsecase,
    deleteOwnerUsecase: DeleteOwnerUsecase,
    getOwnerByIdUsecase: GetOwnerByIdUsecase,
    updateOwnerUsecase: UpdateOwnerUsecase,
    getAllOwnersUsecase: GetAllOwnersUsecase
  ) {
    this.createOwnerUsecase = createOwnerUsecase;
    this.deleteOwnerUsecase = deleteOwnerUsecase;
    this.getOwnerByIdUsecase = getOwnerByIdUsecase;
    this.updateOwnerUsecase = updateOwnerUsecase;
    this.getAllOwnersUsecase = getAllOwnersUsecase;
  }

  async createOwner(req: Request, res: Response): Promise<void> {
      
      // Extract owner data from the request body and convert it to OwnerModel
      const ownerData: OwnerModel = OwnerMapper.toModel(req.body);

      // Call the createOwnerUsecase to create the owner
      const newOwner: Either<ErrorClass, OwnerEntity> = await this.createOwnerUsecase.execute(
        ownerData
      );

      newOwner.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: OwnerEntity) =>{
          const responseData = OwnerMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteOwner(req: Request, res: Response): Promise<void> {
    const ownerId: string = req.params.ownerId;

    // Call the DeleteOwnerUsecase to delete the owner
    const updatedOwnerEntity: OwnerEntity = OwnerMapper.toEntity(
      { disabled: true },
      true
    );

    // Call the UpdateOwnerUsecase to update the owner
    const updatedOwner: Either<ErrorClass, OwnerEntity> = await this.updateOwnerUsecase.execute(
      ownerId,
      updatedOwnerEntity
    );

    updatedOwner.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus owner deleted successfully' });
        }
    );
}

  // async getOwnerById(req: Request, res: Response): Promise<void> {
  //     const ownerId: string = req.params.ownerId;

  //     // Call the GetOwnerByIdUsecase to get the owner by ID
  //     const owner: Either<ErrorClass, OwnerEntity | null> = await this.getOwnerByIdUsecase.execute(
  //       ownerId
  //     );

  //     owner.cata(
  //       (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //       (result: OwnerEntity | null) =>{
  //         const responseData = OwnerMapper.toEntity(result, true);
  //         return res.json(responseData)
  //       }
  //     )
  // }

  async getOwnerById(req: Request, res: Response): Promise<void> {
    const ownerId: string = req.params.ownerId;

    // Call the GetOwnerByIdUsecase to get the Owner by ID
    const owner: Either<ErrorClass, OwnerEntity | null> = await this.getOwnerByIdUsecase.execute(
      ownerId
    );

    owner.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: OwnerEntity | null) =>{
        const responseData = OwnerMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateOwner(req: Request, res: Response): Promise<void> {
    
      const ownerId: string = req.params.ownerId;
      const ownerData: OwnerModel = req.body;

      // Get the existing owner by ID
      const existingOwner: Either<ErrorClass, OwnerEntity | null> =
        await this.getOwnerByIdUsecase.execute(ownerId);

      if (!existingOwner) {
        // If owner is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert ownerData from OwnerModel to OwnerEntity using OwnerMapper
      const updatedOwnerEntity: OwnerEntity = OwnerMapper.toEntity(
        ownerData,
        true,
      );

      // Call the UpdateOwnerUsecase to update the owner
      const updatedOwner: Either<ErrorClass, OwnerEntity> = await this.updateOwnerUsecase.execute(
        ownerId,
        updatedOwnerEntity
      );

      updatedOwner.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: OwnerEntity) =>{
          const responseData = OwnerMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

async getAllOwners(req: Request, res: Response, next:NextFunction): Promise<void> {
  // Call the GetAllOwnersUsecase to get all owners
  const owners: Either<ErrorClass, OwnerEntity[]> = await this.getAllOwnersUsecase.execute();

  owners.cata(
    (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
    (result: OwnerEntity[]) => {
      // Filter out tables with del_status set to "Deleted"
      const nonDeletedOwner = result.filter((owner) => owner.disabled !== true);

      // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
      const responseData = nonDeletedOwner.map((Owner) => OwnerMapper.toEntity(Owner));
      return res.json(responseData);
    }
  )
}

}
