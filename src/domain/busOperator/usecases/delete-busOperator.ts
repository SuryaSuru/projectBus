import {type BusOperatorRepository } from "@domain/busOperator/repositories/busOperator-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteBusOperatorUsecase {
  execute: (busOperatorId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBusOperator implements DeleteBusOperatorUsecase {
  private readonly busOperatorRepository: BusOperatorRepository;

  constructor(busOperatorRepository: BusOperatorRepository) {
    this.busOperatorRepository = busOperatorRepository;
  }

  async execute(busOperatorId: string): Promise<Either<ErrorClass, void>> {
    return await this.busOperatorRepository.deleteBusOperator(busOperatorId);
  }
}
