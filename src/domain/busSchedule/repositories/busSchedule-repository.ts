import { BusScheduleModel, BusScheduleEntity } from "@domain/busSchedule/entities/busSchedule";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface BusScheduleRepository {
  createBusSchedule(BusSchedule: BusScheduleModel): Promise<Either<ErrorClass, BusScheduleEntity>>;
  deleteBusSchedule(id: string): Promise<Either<ErrorClass, void>>;
  updateBusSchedule(id: string, data: BusScheduleModel): Promise<Either<ErrorClass, BusScheduleEntity>>;
  getBusSchedules(): Promise<Either<ErrorClass, BusScheduleEntity[]>>;
  getBusScheduleById(id: string): Promise<Either<ErrorClass, BusScheduleEntity | null>>;
}

