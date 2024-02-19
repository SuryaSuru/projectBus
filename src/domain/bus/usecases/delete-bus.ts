import {type BusRepository } from "@domain/bus/repositories/bus-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteBusUsecase {
  execute: (busId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBus implements DeleteBusUsecase {
  private readonly busRepository: BusRepository;

  constructor(busRepository: BusRepository) {
    this.busRepository = busRepository;
  }

  async execute(busId: string): Promise<Either<ErrorClass, void>> {
    return await this.busRepository.deleteBus(busId);
  }
}
