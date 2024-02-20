import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface BusRepository {
  createBus(Bus: BusModel): Promise<Either<ErrorClass, BusEntity>>;
  deleteBus(id: string): Promise<Either<ErrorClass, void>>;
  updateBus(id: string, data: BusModel): Promise<Either<ErrorClass, BusEntity>>;
  getbuses(query: object): Promise<Either<ErrorClass, BusEntity[]>>;
  getBusById(id: string): Promise<Either<ErrorClass, BusEntity | null>>;
}

