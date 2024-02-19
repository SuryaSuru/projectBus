import { TravelModel, TravelEntity } from "@domain/travel/entities/travel";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface TravelRepository {
  createTravel(Travel: TravelModel): Promise<Either<ErrorClass, TravelEntity>>;
  deleteTravel(id: string): Promise<Either<ErrorClass, void>>;
  updateTravel(id: string, data: TravelModel): Promise<Either<ErrorClass, TravelEntity>>;
  getTravels(): Promise<Either<ErrorClass, TravelEntity[]>>;
  getTravelById(id: string): Promise<Either<ErrorClass, TravelEntity | null>>;
}

