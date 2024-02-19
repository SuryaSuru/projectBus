import { TravelModel, TravelEntity } from "@domain/travel/entities/travel";
import { TravelRepository } from "@domain/travel/repositories/travel-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllTravelsUsecase {
  execute: () => Promise<Either<ErrorClass, TravelEntity[]>>;
}

export class GetAllTravels implements GetAllTravelsUsecase {
  private readonly travelRepository: TravelRepository;

  constructor(travelRepository: TravelRepository) {
    this.travelRepository = travelRepository;
  }

  async execute(): Promise<Either<ErrorClass, TravelEntity[]>> {
    return await this.travelRepository.getTravels();
  }
}
