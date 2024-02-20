import { BusRouteModel, BusRouteEntity } from "@domain/busRoute/entities/busRoute";
import { BusRouteRepository } from "@domain/busRoute/repositories/busRoute-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllBusRoutesUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, BusRouteEntity[]>>;
}

export class GetAllBusRoutes implements GetAllBusRoutesUsecase {
  private readonly busRouteRepository: BusRouteRepository;

  constructor(busRouteRepository: BusRouteRepository) {
    this.busRouteRepository = busRouteRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, BusRouteEntity[]>> {
    return await this.busRouteRepository.getBusRoutes(query);
  }
}
