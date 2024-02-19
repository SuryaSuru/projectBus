import { BusRouteModel, BusRouteEntity } from "@domain/busRoute/entities/busRoute";
import { BusRouteRepository } from "@domain/busRoute/repositories/busRoute-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateBusRouteUsecase {
  execute: (
    busRouteId: string,
    busRouteData: BusRouteModel
  ) => Promise<Either<ErrorClass, BusRouteEntity>>;
}

export class UpdateBusRoute implements UpdateBusRouteUsecase {
  private readonly busRouteRepository: BusRouteRepository;

  constructor(busRouteRepository: BusRouteRepository) {
    this.busRouteRepository = busRouteRepository;
  }
  async execute(busRouteId: string, busRouteData: BusRouteModel): Promise<Either<ErrorClass, BusRouteEntity>> {
   return await this.busRouteRepository.updateBusRoute(busRouteId, busRouteData);
 }
}
