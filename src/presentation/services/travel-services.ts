import { NextFunction, Request, Response } from "express";
import {
  TravelModel,
  TravelEntity,
  TravelMapper,
} from "@domain/travel/entities/travel";
import { CreateTravelUsecase } from "@domain/travel/usecases/create-travel";
import { DeleteTravelUsecase } from "@domain/travel/usecases/delete-travel";
import { GetTravelByIdUsecase } from "@domain/travel/usecases/get-travel-by-id";
import { UpdateTravelUsecase } from "@domain/travel/usecases/update-travel";
import { GetAllTravelsUsecase } from "@domain/travel/usecases/get-all-travels";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class TravelService {
  private readonly createTravelUsecase: CreateTravelUsecase;
  private readonly deleteTravelUsecase: DeleteTravelUsecase;
  private readonly getTravelByIdUsecase: GetTravelByIdUsecase;
  private readonly updateTravelUsecase: UpdateTravelUsecase;
  private readonly getAllTravelsUsecase: GetAllTravelsUsecase;

  constructor(
    createTravelUsecase: CreateTravelUsecase,
    deleteTravelUsecase: DeleteTravelUsecase,
    getTravelByIdUsecase: GetTravelByIdUsecase,
    updateTravelUsecase: UpdateTravelUsecase,
    getAllTravelsUsecase: GetAllTravelsUsecase
  ) {
    this.createTravelUsecase = createTravelUsecase;
    this.deleteTravelUsecase = deleteTravelUsecase;
    this.getTravelByIdUsecase = getTravelByIdUsecase;
    this.updateTravelUsecase = updateTravelUsecase;
    this.getAllTravelsUsecase = getAllTravelsUsecase;
  }

  async createTravel(req: Request, res: Response): Promise<void> {
      
      // Extract travel data from the request body and convert it to TravelModel
      const travelData: TravelModel = TravelMapper.toModel(req.body);

      // Call the createTravelUsecase to create the travel
      const newTravel: Either<ErrorClass, TravelEntity> = await this.createTravelUsecase.execute(
        travelData
      );

      newTravel.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: TravelEntity) =>{
          const responseData = TravelMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteTravel(req: Request, res: Response): Promise<void> {
    const travelId: string = req.params.travelId;

    // Call the DeleteTravelUsecase to delete the travel
    const deletionResult: Either<ErrorClass, void> = await this.deleteTravelUsecase.execute(travelId);

    deletionResult.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus travel deleted successfully' });
        }
    );
}





  async getTravelById(req: Request, res: Response): Promise<void> {
      const travelId: string = req.params.travelId;

      // Call the GetTravelByIdUsecase to get the travel by ID
      const travel: Either<ErrorClass, TravelEntity | null> = await this.getTravelByIdUsecase.execute(
        travelId
      );

      travel.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: TravelEntity | null) =>{
          const responseData = TravelMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async updateTravel(req: Request, res: Response): Promise<void> {
    
      const travelId: string = req.params.travelId;
      const travelData: TravelModel = req.body;

      // Get the existing travel by ID
      const existingTravel: Either<ErrorClass, TravelEntity | null> =
        await this.getTravelByIdUsecase.execute(travelId);

      if (!existingTravel) {
        // If travel is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert travelData from TravelModel to TravelEntity using TravelMapper
      const updatedTravelEntity: TravelEntity = TravelMapper.toEntity(
        travelData,
        true,
      );

      // Call the UpdateTravelUsecase to update the travel
      const updatedTravel: Either<ErrorClass, TravelEntity> = await this.updateTravelUsecase.execute(
        travelId,
        updatedTravelEntity
      );

      updatedTravel.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: TravelEntity) =>{
          const responseData = TravelMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllTravels(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllTravelsUsecase to get all travels
    const travels: Either<ErrorClass, TravelEntity[]> = await this.getAllTravelsUsecase.execute();

    travels.cata(
        (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
        (result: TravelEntity[]) => {
            // Convert travels from an array of TravelEntity to an array of plain JSON objects using TravelMapper
            const responseData = result.map((travel) => TravelMapper.toEntity(travel));
            return res.json(responseData);
        }
    );
}

}
