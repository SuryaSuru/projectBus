import { TravelModel, TravelEntity } from "@domain/travel/entities/travel";
import { TravelRepository } from "@domain/travel/repositories/travel-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateTravelUsecase {
  execute: (
    travelId: string,
    travelData: TravelModel
  ) => Promise<Either<ErrorClass, TravelEntity>>;
}

export class UpdateTravel implements UpdateTravelUsecase {
  private readonly travelRepository: TravelRepository;

  constructor(travelRepository: TravelRepository) {
    this.travelRepository = travelRepository;
  }
  async execute(travelId: string, travelData: TravelModel): Promise<Either<ErrorClass, TravelEntity>> {
   return await this.travelRepository.updateTravel(travelId, travelData);
 }
}
