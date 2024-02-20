import { BusOperatorModel, BusOperatorEntity } from "@domain/busOperator/entities/busOperator";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface BusOperatorRepository {
  createBusOperator(BusOperator: BusOperatorModel): Promise<Either<ErrorClass, BusOperatorEntity>>;
  deleteBusOperator(id: string): Promise<Either<ErrorClass, void>>;
  updateBusOperator(id: string, data: BusOperatorModel): Promise<Either<ErrorClass, BusOperatorEntity>>;
  getBusOperators(query: object): Promise<Either<ErrorClass, BusOperatorEntity[]>>;
  getBusOperatorById(id: string): Promise<Either<ErrorClass, BusOperatorEntity | null>>;
}

