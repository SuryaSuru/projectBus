import {type BusScheduleRepository } from "@domain/busSchedule/repositories/busSchedule-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteBusScheduleUsecase {
  execute: (busScheduleId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteBusSchedule implements DeleteBusScheduleUsecase {
  private readonly busScheduleRepository: BusScheduleRepository;

  constructor(busScheduleRepository: BusScheduleRepository) {
    this.busScheduleRepository = busScheduleRepository;
  }

  async execute(busScheduleId: string): Promise<Either<ErrorClass, void>> {
    return await this.busScheduleRepository.deleteBusSchedule(busScheduleId);
  }
}
