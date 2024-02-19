import { BusScheduleModel, BusScheduleEntity } from "@domain/busSchedule/entities/busSchedule";
import { BusScheduleRepository } from "@domain/busSchedule/repositories/busSchedule-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateBusScheduleUsecase {
  execute: (busScheduleData: BusScheduleModel) => Promise<Either<ErrorClass, BusScheduleEntity>>;
}

export class CreateBusSchedule implements CreateBusScheduleUsecase {
  private readonly busScheduleRepository: BusScheduleRepository;

  constructor(busScheduleRepository: BusScheduleRepository) {
    this.busScheduleRepository = busScheduleRepository;
  }

  async execute(busScheduleData: BusScheduleModel): Promise<Either<ErrorClass, BusScheduleEntity>> {
    return await this.busScheduleRepository.createBusSchedule(busScheduleData);
  }
}
