import { BusRouteModel, BusRouteEntity } from "@domain/busRoute/entities/busRoute";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface BusRouteRepository {
  createBusRoute(BusRoute: BusRouteModel): Promise<Either<ErrorClass, BusRouteEntity>>;
  deleteBusRoute(id: string): Promise<Either<ErrorClass, void>>;
  updateBusRoute(id: string, data: BusRouteModel): Promise<Either<ErrorClass, BusRouteEntity>>;
  getBusRoutes(query: object): Promise<Either<ErrorClass, BusRouteEntity[]>>;
  getBusRouteById(id: string): Promise<Either<ErrorClass, BusRouteEntity | null>>;
}

