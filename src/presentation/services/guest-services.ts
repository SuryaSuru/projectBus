import { NextFunction, Request, Response } from "express";
import {
  GuestModel,
  GuestEntity,
  GuestMapper,
} from "@domain/guest/entities/guest";
import { CreateGuestUsecase } from "@domain/guest/usecases/create-guest";
import { DeleteGuestUsecase } from "@domain/guest/usecases/delete-guest";
import { GetGuestByIdUsecase } from "@domain/guest/usecases/get-guest-by-id";
import { UpdateGuestUsecase } from "@domain/guest/usecases/update-guest";
import { GetAllGuestsUsecase } from "@domain/guest/usecases/get-all-guests";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class GuestService {
  private readonly createGuestUsecase: CreateGuestUsecase;
  private readonly deleteGuestUsecase: DeleteGuestUsecase;
  private readonly getGuestByIdUsecase: GetGuestByIdUsecase;
  private readonly updateGuestUsecase: UpdateGuestUsecase;
  private readonly getAllGuestsUsecase: GetAllGuestsUsecase;

  constructor(
    createGuestUsecase: CreateGuestUsecase,
    deleteGuestUsecase: DeleteGuestUsecase,
    getGuestByIdUsecase: GetGuestByIdUsecase,
    updateGuestUsecase: UpdateGuestUsecase,
    getAllGuestsUsecase: GetAllGuestsUsecase
  ) {
    this.createGuestUsecase = createGuestUsecase;
    this.deleteGuestUsecase = deleteGuestUsecase;
    this.getGuestByIdUsecase = getGuestByIdUsecase;
    this.updateGuestUsecase = updateGuestUsecase;
    this.getAllGuestsUsecase = getAllGuestsUsecase;
  }

  async createGuest(req: Request, res: Response): Promise<void> {
      
      // Extract guest data from the request body and convert it to GuestModel
      const guestData: GuestModel = GuestMapper.toModel(req.body);

      // Call the createGuestUsecase to create the guest
      const newGuest: Either<ErrorClass, GuestEntity> = await this.createGuestUsecase.execute(
        guestData
      );

      newGuest.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: GuestEntity) =>{
          const responseData = GuestMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteGuest(req: Request, res: Response): Promise<void> {
    const guestId: string = req.params.guestId;

    // Call the DeleteGuestUsecase to delete the guest
    const deletionResult: Either<ErrorClass, void> = await this.deleteGuestUsecase.execute(guestId);

    deletionResult.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Bus guest deleted successfully' });
        }
    );
}





  async getGuestById(req: Request, res: Response): Promise<void> {
      const guestId: string = req.params.guestId;

      // Call the GetGuestByIdUsecase to get the guest by ID
      const guest: Either<ErrorClass, GuestEntity | null> = await this.getGuestByIdUsecase.execute(
        guestId
      );

      guest.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: GuestEntity | null) =>{
          const responseData = GuestMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async updateGuest(req: Request, res: Response): Promise<void> {
    
      const guestId: string = req.params.guestId;
      const guestData: GuestModel = req.body;

      // Get the existing guest by ID
      const existingGuest: Either<ErrorClass, GuestEntity | null> =
        await this.getGuestByIdUsecase.execute(guestId);

      if (!existingGuest) {
        // If guest is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert guestData from GuestModel to GuestEntity using GuestMapper
      const updatedGuestEntity: GuestEntity = GuestMapper.toEntity(
        guestData,
        true,
      );

      // Call the UpdateGuestUsecase to update the guest
      const updatedGuest: Either<ErrorClass, GuestEntity> = await this.updateGuestUsecase.execute(
        guestId,
        updatedGuestEntity
      );

      updatedGuest.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: GuestEntity) =>{
          const responseData = GuestMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllGuests(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllGuestsUsecase to get all guests
    const guests: Either<ErrorClass, GuestEntity[]> = await this.getAllGuestsUsecase.execute();

    guests.cata(
        (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
        (result: GuestEntity[]) => {
            // Convert guests from an array of GuestEntity to an array of plain JSON objects using GuestMapper
            const responseData = result.map((guest) => GuestMapper.toEntity(guest));
            return res.json(responseData);
        }
    );
}

}
