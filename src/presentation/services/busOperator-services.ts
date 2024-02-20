import { NextFunction, Request, Response } from "express";
import {
  BusOperatorModel,
  BusOperatorEntity,
  BusOperatorMapper,
} from "@domain/busOperator/entities/busOperator";
import { CreateBusOperatorUsecase } from "@domain/busOperator/usecases/create-busOperator";
import { DeleteBusOperatorUsecase } from "@domain/busOperator/usecases/delete-busOperator";
import { GetBusOperatorByIdUsecase } from "@domain/busOperator/usecases/get-busOperator-by-id";
import { UpdateBusOperatorUsecase } from "@domain/busOperator/usecases/update-busOperator";
import { GetAllBusOperatorsUsecase } from "@domain/busOperator/usecases/get-all-busOperators";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class BusOperatorService {
  private readonly createBusOperatorUsecase: CreateBusOperatorUsecase;
  private readonly deleteBusOperatorUsecase: DeleteBusOperatorUsecase;
  private readonly getBusOperatorByIdUsecase: GetBusOperatorByIdUsecase;
  private readonly updateBusOperatorUsecase: UpdateBusOperatorUsecase;
  private readonly getAllBusOperatorsUsecase: GetAllBusOperatorsUsecase;

  constructor(
    createBusOperatorUsecase: CreateBusOperatorUsecase,
    deleteBusOperatorUsecase: DeleteBusOperatorUsecase,
    getBusOperatorByIdUsecase: GetBusOperatorByIdUsecase,
    updateBusOperatorUsecase: UpdateBusOperatorUsecase,
    getAllBusOperatorsUsecase: GetAllBusOperatorsUsecase
  ) {
    this.createBusOperatorUsecase = createBusOperatorUsecase;
    this.deleteBusOperatorUsecase = deleteBusOperatorUsecase;
    this.getBusOperatorByIdUsecase = getBusOperatorByIdUsecase;
    this.updateBusOperatorUsecase = updateBusOperatorUsecase;
    this.getAllBusOperatorsUsecase = getAllBusOperatorsUsecase;
  }

  async createBusOperator(req: Request, res: Response): Promise<void> {
      
      // Extract busOperator data from the request body and convert it to BusOperatorModel
      const busOperatorData: BusOperatorModel = BusOperatorMapper.toModel(req.body);

      // Call the createBusOperatorUsecase to create the busOperator
      const newBusOperator: Either<ErrorClass, BusOperatorEntity> = await this.createBusOperatorUsecase.execute(
        busOperatorData
      );

      newBusOperator.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusOperatorEntity) =>{
          const responseData = BusOperatorMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteBusOperator(req: Request, res: Response): Promise<void> {
    const busOperatorId: string = req.params.busOperatorId;

    // Call the DeleteBusOperatorUsecase to delete the busOperator
    const updatedBusOperatorEntity: BusOperatorEntity = BusOperatorMapper.toEntity(
      { disabled: true },
      true
    );

    // Call the UpdateBusOperatorUsecase to update the busOperator
    const updatedBusOperator: Either<ErrorClass, BusOperatorEntity> = await this.updateBusOperatorUsecase.execute(
      busOperatorId,
      updatedBusOperatorEntity
    );

    updatedBusOperator.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus busOperator deleted successfully' });
        }
    );
}

  async getBusOperatorById(req: Request, res: Response): Promise<void> {
    const busOperatorId: string = req.params.busOperatorId;

    // Call the GetBusOperatorByIdUsecase to get the BusOperator by ID
    const busOperator: Either<ErrorClass, BusOperatorEntity | null> = await this.getBusOperatorByIdUsecase.execute(
      busOperatorId
    );

    busOperator.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: BusOperatorEntity | null) =>{
        const responseData = BusOperatorMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateBusOperator(req: Request, res: Response): Promise<void> {
    
      const busOperatorId: string = req.params.busOperatorId;
      const busOperatorData: BusOperatorModel = req.body;

      // Get the existing busOperator by ID
      const existingBusOperator: Either<ErrorClass, BusOperatorEntity | null> =
        await this.getBusOperatorByIdUsecase.execute(busOperatorId);

      if (!existingBusOperator) {
        // If busOperator is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert busOperatorData from BusOperatorModel to BusOperatorEntity using BusOperatorMapper
      const updatedBusOperatorEntity: BusOperatorEntity = BusOperatorMapper.toEntity(
        busOperatorData,
        true,
      );

      // Call the UpdateBusOperatorUsecase to update the busOperator
      const updatedBusOperator: Either<ErrorClass, BusOperatorEntity> = await this.updateBusOperatorUsecase.execute(
        busOperatorId,
        updatedBusOperatorEntity
      );

      updatedBusOperator.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusOperatorEntity) =>{
          const responseData = BusOperatorMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllBusOperators(req: Request, res: Response, next:NextFunction): Promise<void> {
    const query: any = {};
    query.search = req.query.search as string;

    // Call the GetAllBusOperatorsUsecase to get all busOperators
    const busOperators: Either<ErrorClass, BusOperatorEntity[]> = 
    await this.getAllBusOperatorsUsecase.execute(query);
  
    busOperators.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: BusOperatorEntity[]) => {
        // Filter out tables with del_status set to "Deleted"
        const nonDeletedBusOperator = result.filter((busOperator) => busOperator.disabled !== true);
  
        // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
        const responseData = nonDeletedBusOperator.map((BusOperator) => BusOperatorMapper.toEntity(BusOperator));
        return res.json(responseData);
      }
    )
  }

}
