import { NextFunction, Request, Response } from "express";
import {
  BusScheduleModel,
  BusScheduleEntity,
  BusScheduleMapper,
} from "@domain/busSchedule/entities/busSchedule";
import { CreateBusScheduleUsecase } from "@domain/busSchedule/usecases/create-busSchedule";
import { DeleteBusScheduleUsecase } from "@domain/busSchedule/usecases/delete-busSchedule";
import { GetBusScheduleByIdUsecase } from "@domain/busSchedule/usecases/get-busSchedule-by-id";
import { UpdateBusScheduleUsecase } from "@domain/busSchedule/usecases/update-busSchedule";
import { GetAllBusSchedulesUsecase } from "@domain/busSchedule/usecases/get-all-busSchedules";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class BusScheduleService {
  private readonly createBusScheduleUsecase: CreateBusScheduleUsecase;
  private readonly deleteBusScheduleUsecase: DeleteBusScheduleUsecase;
  private readonly getBusScheduleByIdUsecase: GetBusScheduleByIdUsecase;
  private readonly updateBusScheduleUsecase: UpdateBusScheduleUsecase;
  private readonly getAllBusSchedulesUsecase: GetAllBusSchedulesUsecase;

  constructor(
    createBusScheduleUsecase: CreateBusScheduleUsecase,
    deleteBusScheduleUsecase: DeleteBusScheduleUsecase,
    getBusScheduleByIdUsecase: GetBusScheduleByIdUsecase,
    updateBusScheduleUsecase: UpdateBusScheduleUsecase,
    getAllBusSchedulesUsecase: GetAllBusSchedulesUsecase
  ) {
    this.createBusScheduleUsecase = createBusScheduleUsecase;
    this.deleteBusScheduleUsecase = deleteBusScheduleUsecase;
    this.getBusScheduleByIdUsecase = getBusScheduleByIdUsecase;
    this.updateBusScheduleUsecase = updateBusScheduleUsecase;
    this.getAllBusSchedulesUsecase = getAllBusSchedulesUsecase;
  }

  async createBusSchedule(req: Request, res: Response): Promise<void> {
      
      // Extract busSchedule data from the request body and convert it to BusScheduleModel
      const busScheduleData: BusScheduleModel = BusScheduleMapper.toModel(req.body);

      // Call the createBusScheduleUsecase to create the busSchedule
      const newBusSchedule: Either<ErrorClass, BusScheduleEntity> = await this.createBusScheduleUsecase.execute(
        busScheduleData
      );

      newBusSchedule.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusScheduleEntity) =>{
          const responseData = BusScheduleMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteBusSchedule(req: Request, res: Response): Promise<void> {
    const busScheduleId: string = req.params.busScheduleId;

    // Call the DeleteBusScheduleUsecase to delete the busSchedule
    const updatedBusScheduleEntity: BusScheduleEntity = BusScheduleMapper.toEntity(
      { scheduleStatus : "Cancelled" },
      true
    );

    // Call the UpdateBusScheduleUsecase to update the busSchedule
    const updatedBusSchedule: Either<ErrorClass, BusScheduleEntity> = await this.updateBusScheduleUsecase.execute(
      busScheduleId,
      updatedBusScheduleEntity
    );

    updatedBusSchedule.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus busSchedule deleted successfully' });
        }
    );
}

  async getBusScheduleById(req: Request, res: Response): Promise<void> {
      const busScheduleId: string = req.params.busScheduleId;

      // Call the GetBusScheduleByIdUsecase to get the busSchedule by ID
      const busSchedule: Either<ErrorClass, BusScheduleEntity | null> = await this.getBusScheduleByIdUsecase.execute(
        busScheduleId
      );

      busSchedule.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusScheduleEntity | null) =>{
          const responseData = BusScheduleMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async updateBusSchedule(req: Request, res: Response): Promise<void> {
    
      const busScheduleId: string = req.params.busScheduleId;
      const busScheduleData: BusScheduleModel = req.body;

      // Get the existing busSchedule by ID
      const existingBusSchedule: Either<ErrorClass, BusScheduleEntity | null> =
        await this.getBusScheduleByIdUsecase.execute(busScheduleId);

      if (!existingBusSchedule) {
        // If busSchedule is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert busScheduleData from BusScheduleModel to BusScheduleEntity using BusScheduleMapper
      const updatedBusScheduleEntity: BusScheduleEntity = BusScheduleMapper.toEntity(
        busScheduleData,
        true,
      );

      // Call the UpdateBusScheduleUsecase to update the busSchedule
      const updatedBusSchedule: Either<ErrorClass, BusScheduleEntity> = await this.updateBusScheduleUsecase.execute(
        busScheduleId,
        updatedBusScheduleEntity
      );

      updatedBusSchedule.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusScheduleEntity) =>{
          const responseData = BusScheduleMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllBusSchedules(req: Request, res: Response, next:NextFunction): Promise<void> {
    // Call the GetAllBusSchedulesUsecase to get all busSchedules
    const busSchedules: Either<ErrorClass, BusScheduleEntity[]> = await this.getAllBusSchedulesUsecase.execute();
  
    busSchedules.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: BusScheduleEntity[]) => {
        // Filter out tables with del_status set to "Deleted"
        const nonDeletedBusSchedule = result.filter((busSchedule) => busSchedule.scheduleStatus !== "Cancelled");
  
        // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
        const responseData = nonDeletedBusSchedule.map((BusSchedule) => BusScheduleMapper.toEntity(BusSchedule));
        return res.json(responseData);
      }
    )
  }

}
