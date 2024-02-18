import { NextFunction, Request, Response } from "express";
import {
  BusRouteModel,
  BusRouteEntity,
  BusRouteMapper,
} from "@domain/busRoute/entities/busRoute";
import { CreateBusRouteUsecase } from "@domain/busRoute/usecases/create-busRoute";
import { DeleteBusRouteUsecase } from "@domain/busRoute/usecases/delete-busRoute";
import { GetBusRouteByIdUsecase } from "@domain/busRoute/usecases/get-busRoute-by-id";
import { UpdateBusRouteUsecase } from "@domain/busRoute/usecases/update-busRoute";
import { GetAllBusRoutesUsecase } from "@domain/busRoute/usecases/get-all-busRoutes";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class BusRouteService {
  private readonly createBusRouteUsecase: CreateBusRouteUsecase;
  private readonly deleteBusRouteUsecase: DeleteBusRouteUsecase;
  private readonly getBusRouteByIdUsecase: GetBusRouteByIdUsecase;
  private readonly updateBusRouteUsecase: UpdateBusRouteUsecase;
  private readonly getAllBusRoutesUsecase: GetAllBusRoutesUsecase;

  constructor(
    createBusRouteUsecase: CreateBusRouteUsecase,
    deleteBusRouteUsecase: DeleteBusRouteUsecase,
    getBusRouteByIdUsecase: GetBusRouteByIdUsecase,
    updateBusRouteUsecase: UpdateBusRouteUsecase,
    getAllBusRoutesUsecase: GetAllBusRoutesUsecase
  ) {
    this.createBusRouteUsecase = createBusRouteUsecase;
    this.deleteBusRouteUsecase = deleteBusRouteUsecase;
    this.getBusRouteByIdUsecase = getBusRouteByIdUsecase;
    this.updateBusRouteUsecase = updateBusRouteUsecase;
    this.getAllBusRoutesUsecase = getAllBusRoutesUsecase;
  }

  async createBusRoute(req: Request, res: Response): Promise<void> {
      
      // Extract busRoute data from the request body and convert it to BusRouteModel
      const busRouteData: BusRouteModel = BusRouteMapper.toModel(req.body);

      // Call the createBusRouteUsecase to create the busRoute
      const newBusRoute: Either<ErrorClass, BusRouteEntity> = await this.createBusRouteUsecase.execute(
        busRouteData
      );

      newBusRoute.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusRouteEntity) =>{
          const responseData = BusRouteMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteBusRoute(req: Request, res: Response): Promise<void> {
    const busRouteId: string = req.params.busRouteId;

    // Call the DeleteBusRouteUsecase to delete the busRoute
    const updatedBusRouteEntity: BusRouteEntity = BusRouteMapper.toEntity(
      { disabled: true },
      true
    );

    // Call the UpdateBusRouteUsecase to update the busRoute
    const updatedBusRoute: Either<ErrorClass, BusRouteEntity> = await this.updateBusRouteUsecase.execute(
      busRouteId,
      updatedBusRouteEntity
    );

    updatedBusRoute.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus busRoute deleted successfully' });
        }
    );
}

  // async getBusRouteById(req: Request, res: Response): Promise<void> {
  //     const busRouteId: string = req.params.busRouteId;

  //     // Call the GetBusRouteByIdUsecase to get the busRoute by ID
  //     const busRoute: Either<ErrorClass, BusRouteEntity | null> = await this.getBusRouteByIdUsecase.execute(
  //       busRouteId
  //     );

  //     busRoute.cata(
  //       (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //       (result: BusRouteEntity | null) =>{
  //         const responseData = BusRouteMapper.toEntity(result, true);
  //         return res.json(responseData)
  //       }
  //     )
  // }

  async getBusRouteById(req: Request, res: Response): Promise<void> {
    const busRouteId: string = req.params.busRouteId;

    // Call the GetBusRouteByIdUsecase to get the BusRoute by ID
    const busRoute: Either<ErrorClass, BusRouteEntity | null> = await this.getBusRouteByIdUsecase.execute(
      busRouteId
    );

    busRoute.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: BusRouteEntity | null) =>{
        const responseData = BusRouteMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateBusRoute(req: Request, res: Response): Promise<void> {
    
      const busRouteId: string = req.params.busRouteId;
      const busRouteData: BusRouteModel = req.body;

      // Get the existing busRoute by ID
      const existingBusRoute: Either<ErrorClass, BusRouteEntity | null> =
        await this.getBusRouteByIdUsecase.execute(busRouteId);

      if (!existingBusRoute) {
        // If busRoute is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert busRouteData from BusRouteModel to BusRouteEntity using BusRouteMapper
      const updatedBusRouteEntity: BusRouteEntity = BusRouteMapper.toEntity(
        busRouteData,
        true,
      );

      // Call the UpdateBusRouteUsecase to update the busRoute
      const updatedBusRoute: Either<ErrorClass, BusRouteEntity> = await this.updateBusRouteUsecase.execute(
        busRouteId,
        updatedBusRouteEntity
      );

      updatedBusRoute.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BusRouteEntity) =>{
          const responseData = BusRouteMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

async getAllBusRoutes(req: Request, res: Response, next:NextFunction): Promise<void> {
  // Call the GetAllBusRoutesUsecase to get all busRoutes
  const busRoutes: Either<ErrorClass, BusRouteEntity[]> = await this.getAllBusRoutesUsecase.execute();

  busRoutes.cata(
    (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
    (result: BusRouteEntity[]) => {
      // Filter out tables with del_status set to "Deleted"
      const nonDeletedBusRoute = result.filter((busRoute) => busRoute.disabled !== true);

      // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
      const responseData = nonDeletedBusRoute.map((BusRoute) => BusRouteMapper.toEntity(BusRoute));
      return res.json(responseData);
    }
  )
}

}
