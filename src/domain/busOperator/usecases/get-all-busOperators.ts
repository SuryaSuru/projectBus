import { BusOperatorModel, BusOperatorEntity } from "@domain/busOperator/entities/busOperator";
import { BusOperatorRepository } from "@domain/busOperator/repositories/busOperator-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllBusOperatorsUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, BusOperatorEntity[]>>;
}

export class GetAllBusOperators implements GetAllBusOperatorsUsecase {
  private readonly busOperatorRepository: BusOperatorRepository;

  constructor(busOperatorRepository: BusOperatorRepository) {
    this.busOperatorRepository = busOperatorRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, BusOperatorEntity[]>> {
    return await this.busOperatorRepository.getBusOperators(query);
  }
}
