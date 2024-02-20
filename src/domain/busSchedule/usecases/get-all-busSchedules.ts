import { BusScheduleModel, BusScheduleEntity } from "@domain/busSchedule/entities/busSchedule";
import { BusScheduleRepository } from "@domain/busSchedule/repositories/busSchedule-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllBusSchedulesUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, BusScheduleEntity[]>>;
}

export class GetAllBusSchedules implements GetAllBusSchedulesUsecase {
  private readonly busScheduleRepository: BusScheduleRepository;

  constructor(busScheduleRepository: BusScheduleRepository) {
    this.busScheduleRepository = busScheduleRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, BusScheduleEntity[]>> {
    return await this.busScheduleRepository.getBusSchedules(query);
  }
}
