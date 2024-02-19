import { BusOperatorModel, BusOperatorEntity } from "@domain/busOperator/entities/busOperator";
import { BusOperatorRepository } from "@domain/busOperator/repositories/busOperator-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateBusOperatorUsecase {
  execute: (
    busOperatorId: string,
    busOperatorData: BusOperatorModel
  ) => Promise<Either<ErrorClass, BusOperatorEntity>>;
}

export class UpdateBusOperator implements UpdateBusOperatorUsecase {
  private readonly busOperatorRepository: BusOperatorRepository;

  constructor(busOperatorRepository: BusOperatorRepository) {
    this.busOperatorRepository = busOperatorRepository;
  }
  async execute(busOperatorId: string, busOperatorData: BusOperatorModel): Promise<Either<ErrorClass, BusOperatorEntity>> {
   return await this.busOperatorRepository.updateBusOperator(busOperatorId, busOperatorData);
 }
}
