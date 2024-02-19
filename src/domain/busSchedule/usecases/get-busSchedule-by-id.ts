import { BusScheduleModel, BusScheduleEntity } from "@domain/busSchedule/entities/busSchedule";
import { BusScheduleRepository } from "@domain/busSchedule/repositories/busSchedule-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetBusScheduleByIdUsecase {
  execute: (busScheduleId: string) => Promise<Either<ErrorClass, BusScheduleEntity | null>>;
}

export class GetBusScheduleById implements GetBusScheduleByIdUsecase {
  private readonly busScheduleRepository: BusScheduleRepository;

  constructor(busScheduleRepository: BusScheduleRepository) {
    this.busScheduleRepository = busScheduleRepository;
  }

  async execute(busScheduleId: string): Promise<Either<ErrorClass, BusScheduleEntity | null>> {
    return await this.busScheduleRepository.getBusScheduleById(busScheduleId);
  }
}
