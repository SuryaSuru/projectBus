import { GuestModel, GuestEntity } from "@domain/guest/entities/guest";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface GuestRepository {
  createGuest(Guest: GuestModel): Promise<Either<ErrorClass, GuestEntity>>;
  deleteGuest(id: string): Promise<Either<ErrorClass, void>>;
  updateGuest(id: string, data: GuestModel): Promise<Either<ErrorClass, GuestEntity>>;
  getGuests(): Promise<Either<ErrorClass, GuestEntity[]>>;
  getGuestById(id: string): Promise<Either<ErrorClass, GuestEntity | null>>;
}

