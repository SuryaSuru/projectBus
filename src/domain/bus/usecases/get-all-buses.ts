import { BusModel, BusEntity } from "@domain/bus/entities/bus";
import { BusRepository } from "@domain/bus/repositories/bus-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllbusesUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, BusEntity[]>>;
}

export class GetAllbuses implements GetAllbusesUsecase {
  private readonly busRepository: BusRepository;

  constructor(busRepository: BusRepository) {
    this.busRepository = busRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, BusEntity[]>> {
    return await this.busRepository.getbuses(query);
  }
}
