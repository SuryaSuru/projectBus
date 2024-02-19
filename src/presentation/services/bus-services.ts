import { NextFunction, Request, Response } from "express";
import {
  BusModel,
  BusEntity,
  BusMapper,
} from "@domain/bus/entities/bus";
import { CreateBusUsecase } from "@domain/bus/usecases/create-bus";
import { DeleteBusUsecase } from "@domain/bus/usecases/delete-bus";
import { GetBusByIdUsecase } from "@domain/bus/usecases/get-bus-by-id";
import { UpdateBusUsecase } from "@domain/bus/usecases/update-bus";
import { GetAllbusesUsecase } from "@domain/bus/usecases/get-all-buses";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class buseservice {
  private readonly createBusUsecase: CreateBusUsecase;
  private readonly deleteBusUsecase: DeleteBusUsecase;
  private readonly getBusByIdUsecase: GetBusByIdUsecase;
  private readonly updateBusUsecase: UpdateBusUsecase;
  private readonly getAllbusesUsecase: GetAllbusesUsecase;

  constructor(
    createBusUsecase: CreateBusUsecase,
    deleteBusUsecase: DeleteBusUsecase,
    getBusByIdUsecase: GetBusByIdUsecase,
    updateBusUsecase: UpdateBusUsecase,
    getAllbusesUsecase: GetAllbusesUsecase
  ) {
    this.createBusUsecase = createBusUsecase;
    this.deleteBusUsecase = deleteBusUsecase;
    this.getBusByIdUsecase = getBusByIdUsecase;
    this.updateBusUsecase = updateBusUsecase;
    this.getAllbusesUsecase = getAllbusesUsecase;
  }

  async createBus(req: Request, res: Response): Promise<void> {
      
      // Extract bus data from the request body and convert it to BusModel
      const busData: BusModel = BusMapper.toModel(req.body);
      console.log("busData--->", busData);
      

      // Call the createBusUsecase to create the bus
      const newBus: Either<ErrorClass, BusEntity> = await this.createBusUsecase.execute(
        busData
      );
      console.log("newBus--->", newBus);

      newBus.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusEntity) =>{
          const responseData = BusMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteBus(req: Request, res: Response): Promise<void> {
    const busId: string = req.params.busId;

    // Call the DeleteBusUsecase to delete the bus
    const updatedBusEntity: BusEntity = BusMapper.toEntity(
      { disabled: true },
      true
    );

    // Call the UpdateBusUsecase to update the bus
    const updatedBus: Either<ErrorClass, BusEntity> = await this.updateBusUsecase.execute(
      busId,
      updatedBusEntity
    );

    updatedBus.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus bus deleted successfully' });
        }
    );
}

  async getBusById(req: Request, res: Response): Promise<void> {
    const busId: string = req.params.busId;

    // Call the GetBusByIdUsecase to get the Bus by ID
    const bus: Either<ErrorClass, BusEntity | null> = await this.getBusByIdUsecase.execute(
      busId
    );

    bus.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: BusEntity | null) =>{
        const responseData = BusMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateBus(req: Request, res: Response): Promise<void> {
    
      const busId: string = req.params.busId;
      const busData: BusModel = req.body;

      // Get the existing bus by ID
      const existingBus: Either<ErrorClass, BusEntity | null> =
        await this.getBusByIdUsecase.execute(busId);

      if (!existingBus) {
        // If bus is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert busData from BusModel to BusEntity using BusMapper
      const updatedBusEntity: BusEntity = BusMapper.toEntity(
        busData,
        true,
      );

      // Call the UpdateBusUsecase to update the bus
      const updatedBus: Either<ErrorClass, BusEntity> = await this.updateBusUsecase.execute(
        busId,
        updatedBusEntity
      );

      updatedBus.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusEntity) =>{
          const responseData = BusMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

async getAllbuses(req: Request, res: Response, next:NextFunction): Promise<void> {
  // Call the GetAllbusesUsecase to get all buses
  const buses: Either<ErrorClass, BusEntity[]> = await this.getAllbusesUsecase.execute();

  buses.cata(
    (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
    (result: BusEntity[]) => {
      // Filter out tables with del_status set to "Deleted"
      const nonDeletedBus = result.filter((bus) => bus.disabled !== true);

      // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
      const responseData = nonDeletedBus.map((Bus) => BusMapper.toEntity(Bus));
      return res.json(responseData);
    }
  )
}

}
