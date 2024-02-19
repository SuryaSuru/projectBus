import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { BusRepository } from "@domain/bus/repositories/bus-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetBusByIdUsecase {
  execute: (busId: string) => Promise<Either<ErrorClass, BusEntity | null>>;
}

export class GetBusById implements GetBusByIdUsecase {
  private readonly busRepository: BusRepository;

  constructor(busRepository: BusRepository) {
    this.busRepository = busRepository;
  }

  async execute(busId: string): Promise<Either<ErrorClass, BusEntity | null>> {
    return await this.busRepository.getBusById(busId);
  }
}
