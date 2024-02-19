import { BusRouteModel, BusRouteEntity } from "@domain/busRoute/entities/busRoute";
import { BusRouteRepository } from "@domain/busRoute/repositories/busRoute-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetBusRouteByIdUsecase {
  execute: (busRouteId: string) => Promise<Either<ErrorClass, BusRouteEntity | null>>;
}

export class GetBusRouteById implements GetBusRouteByIdUsecase {
  private readonly busRouteRepository: BusRouteRepository;

  constructor(busRouteRepository: BusRouteRepository) {
    this.busRouteRepository = busRouteRepository;
  }

  async execute(busRouteId: string): Promise<Either<ErrorClass, BusRouteEntity | null>> {
    return await this.busRouteRepository.getBusRouteById(busRouteId);
  }
}
