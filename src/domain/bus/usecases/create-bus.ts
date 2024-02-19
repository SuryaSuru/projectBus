import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { BusRepository } from "@domain/bus/repositories/bus-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateBusUsecase {
  execute: (busData: BusModel) => Promise<Either<ErrorClass, BusEntity>>;
}

export class CreateBus implements CreateBusUsecase {
  private readonly busRepository: BusRepository;

  constructor(busRepository: BusRepository) {
    this.busRepository = busRepository;
  }

  async execute(busData: BusModel): Promise<Either<ErrorClass, BusEntity>> {
    return await this.busRepository.createBus(busData);
  }
}
