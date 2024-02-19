// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { TravelService } from "@presentation/services/travel-services";
import { TravelDataSourceImpl } from "@data/travel/datasource/travel-data-source";
import { TravelRepositoryImpl } from "@data/travel/repositories/travel-repository-impl";
import { CreateTravel } from "@domain/travel/usecases/create-travel";
import { DeleteTravel } from "@domain/travel/usecases/delete-travel";
import { GetTravelById } from "@domain/travel/usecases/get-travel-by-id";
import { GetAllTravels } from "@domain/travel/usecases/get-all-travels";
import { UpdateTravel } from "@domain/travel/usecases/update-travel";
import { validateTravelInputMiddleware } from "@presentation/middlewares/travel/validation-middleware";

// Create an instance of the TravelDataSourceImpl and pass the mongoose connection
const travelDataSource = new TravelDataSourceImpl(mongoose.connection);

// Create an instance of the TravelRepositoryImpl and pass the TravelDataSourceImpl
const travelRepository = new TravelRepositoryImpl(travelDataSource);

// Create instances of the required use cases and pass the TravelRepositoryImpl
const createTravelUsecase = new CreateTravel(travelRepository);
const deleteTravelUsecase = new DeleteTravel(travelRepository);
const getTravelByIdUsecase = new GetTravelById(travelRepository);
const updateTravelUsecase = new UpdateTravel(travelRepository);
const getAllTravelsUsecase = new GetAllTravels(travelRepository);

// Initialize TravelService and inject required dependencies
const travelService = new TravelService(
  createTravelUsecase,
  deleteTravelUsecase,
  getTravelByIdUsecase,
  updateTravelUsecase,
  getAllTravelsUsecase
);

// Create an Express router
export const travelRouter = Router();

// Route handling for creating a new travel
travelRouter.post("/", validateTravelInputMiddleware(false), travelService.createTravel.bind(travelService));

// Route handling for getting all travels
travelRouter.get("/", travelService.getAllTravels.bind(travelService));

// Route handling for getting an travel by ID
travelRouter.get("/:travelId", travelService.getTravelById.bind(travelService));

// Route handling for updating an travel by ID
travelRouter.put("/:travelId", validateTravelInputMiddleware(true), travelService.updateTravel.bind(travelService));

// Route handling for deleting an travel by ID
travelRouter.delete("/:travelId", travelService.deleteTravel.bind(travelService));
