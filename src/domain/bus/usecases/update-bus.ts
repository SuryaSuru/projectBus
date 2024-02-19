import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { BusRepository } from "@domain/bus/repositories/bus-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateBusUsecase {
  execute: (
    busId: string,
    busData: BusModel
  ) => Promise<Either<ErrorClass, BusEntity>>;
}

export class UpdateBus implements UpdateBusUsecase {
  private readonly busRepository: BusRepository;

  constructor(busRepository: BusRepository) {
    this.busRepository = busRepository;
  }
  async execute(busId: string, busData: BusModel): Promise<Either<ErrorClass, BusEntity>> {
   return await this.busRepository.updateBus(busId, busData);
 }
}
