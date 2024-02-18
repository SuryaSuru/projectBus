import {type BusRouteRepository } from "@domain/busRoute/repositories/busRoute-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteBusRouteUsecase {
  execute: (busRouteId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBusRoute implements DeleteBusRouteUsecase {
  private readonly busRouteRepository: BusRouteRepository;

  constructor(busRouteRepository: BusRouteRepository) {
    this.busRouteRepository = busRouteRepository;
  }

  async execute(busRouteId: string): Promise<Either<ErrorClass, void>> {
    return await this.busRouteRepository.deleteBusRoute(busRouteId);
  }
}
