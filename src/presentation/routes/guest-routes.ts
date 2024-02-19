// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { GuestService } from "@presentation/services/guest-services";
import { GuestDataSourceImpl } from "@data/guest/datasource/guest-data-source";
import { GuestRepositoryImpl } from "@data/guest/repositories/guest-repository-impl";
import { CreateGuest } from "@domain/guest/usecases/create-guest";
import { DeleteGuest } from "@domain/guest/usecases/delete-guest";
import { GetGuestById } from "@domain/guest/usecases/get-guest-by-id";
import { GetAllGuests } from "@domain/guest/usecases/get-all-guests";
import { UpdateGuest } from "@domain/guest/usecases/update-guest";
import { validateGuestInputMiddleware } from "@presentation/middlewares/guest/validation-middleware";

// Create an instance of the GuestDataSourceImpl and pass the mongoose connection
const guestDataSource = new GuestDataSourceImpl(mongoose.connection);

// Create an instance of the GuestRepositoryImpl and pass the GuestDataSourceImpl
const guestRepository = new GuestRepositoryImpl(guestDataSource);

// Create instances of the required use cases and pass the GuestRepositoryImpl
const createGuestUsecase = new CreateGuest(guestRepository);
const deleteGuestUsecase = new DeleteGuest(guestRepository);
const getGuestByIdUsecase = new GetGuestById(guestRepository);
const updateGuestUsecase = new UpdateGuest(guestRepository);
const getAllGuestsUsecase = new GetAllGuests(guestRepository);

// Initialize GuestService and inject required dependencies
const guestService = new GuestService(
  createGuestUsecase,
  deleteGuestUsecase,
  getGuestByIdUsecase,
  updateGuestUsecase,
  getAllGuestsUsecase
);

// Create an Express router
export const guestRouter = Router();

// Route handling for creating a new guest
guestRouter.post("/", validateGuestInputMiddleware(false), guestService.createGuest.bind(guestService));

// Route handling for getting all guests
guestRouter.get("/", guestService.getAllGuests.bind(guestService));

// Route handling for getting an guest by ID
guestRouter.get("/:guestId", guestService.getGuestById.bind(guestService));

// Route handling for updating an guest by ID
guestRouter.put("/:guestId", validateGuestInputMiddleware(true), guestService.updateGuest.bind(guestService));

// Route handling for deleting an guest by ID
guestRouter.delete("/:guestId", guestService.deleteGuest.bind(guestService));
