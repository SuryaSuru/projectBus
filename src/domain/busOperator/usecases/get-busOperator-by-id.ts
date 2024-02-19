import { BusOperatorModel, BusOperatorEntity } from "@domain/busOperator/entities/busOperator";
import { BusOperatorRepository } from "@domain/busOperator/repositories/busOperator-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetBusOperatorByIdUsecase {
  execute: (busOperatorId: string) => Promise<Either<ErrorClass, BusOperatorEntity | null>>;
}

export class GetBusOperatorById implements GetBusOperatorByIdUsecase {
  private readonly busOperatorRepository: BusOperatorRepository;

  constructor(busOperatorRepository: BusOperatorRepository) {
    this.busOperatorRepository = busOperatorRepository;
  }

  async execute(busOperatorId: string): Promise<Either<ErrorClass, BusOperatorEntity | null>> {
    return await this.busOperatorRepository.getBusOperatorById(busOperatorId);
  }
}
