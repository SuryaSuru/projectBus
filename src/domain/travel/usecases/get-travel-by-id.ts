import { TravelModel, TravelEntity } from "@domain/travel/entities/travel";
import { TravelRepository } from "@domain/travel/repositories/travel-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetTravelByIdUsecase {
  execute: (travelId: string) => Promise<Either<ErrorClass, TravelEntity | null>>;
}

export class GetTravelById implements GetTravelByIdUsecase {
  private readonly travelRepository: TravelRepository;

  constructor(travelRepository: TravelRepository) {
    this.travelRepository = travelRepository;
  }

  async execute(travelId: string): Promise<Either<ErrorClass, TravelEntity | null>> {
    return await this.travelRepository.getTravelById(travelId);
  }
}
