import {type TravelRepository } from "@domain/travel/repositories/travel-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteTravelUsecase {
  execute: (travelId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteTravel implements DeleteTravelUsecase {
  private readonly travelRepository: TravelRepository;

  constructor(travelRepository: TravelRepository) {
    this.travelRepository = travelRepository;
  }

  async execute(travelId: string): Promise<Either<ErrorClass, void>> {
    return await this.travelRepository.deleteTravel(travelId);
  }
}
