// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { BusScheduleService } from "@presentation/services/busSchedule-services";
import { BusScheduleDataSourceImpl } from "@data/busSchedule/datasource/busSchedule-data-source";
import { BusScheduleRepositoryImpl } from "@data/busSchedule/repositories/busSchedule-repository-impl";
import { CreateBusSchedule } from "@domain/busSchedule/usecases/create-busSchedule";
import { DeleteBusSchedule } from "@domain/busSchedule/usecases/delete-busSchedule";
import { GetBusScheduleById } from "@domain/busSchedule/usecases/get-busSchedule-by-id";
import { GetAllBusSchedules } from "@domain/busSchedule/usecases/get-all-busSchedules";
import { UpdateBusSchedule } from "@domain/busSchedule/usecases/update-busSchedule";
import { validateBusScheduleInputMiddleware } from "@presentation/middlewares/busSchedule/validation-middleware";

// Create an instance of the BusScheduleDataSourceImpl and pass the mongoose connection
const busScheduleDataSource = new BusScheduleDataSourceImpl(mongoose.connection);

// Create an instance of the BusScheduleRepositoryImpl and pass the BusScheduleDataSourceImpl
const busScheduleRepository = new BusScheduleRepositoryImpl(busScheduleDataSource);

// Create instances of the required use cases and pass the BusScheduleRepositoryImpl
const createBusScheduleUsecase = new CreateBusSchedule(busScheduleRepository);
const deleteBusScheduleUsecase = new DeleteBusSchedule(busScheduleRepository);
const getBusScheduleByIdUsecase = new GetBusScheduleById(busScheduleRepository);
const updateBusScheduleUsecase = new UpdateBusSchedule(busScheduleRepository);
const getAllBusSchedulesUsecase = new GetAllBusSchedules(busScheduleRepository);

// Initialize BusScheduleService and inject required dependencies
const busScheduleService = new BusScheduleService(
  createBusScheduleUsecase,
  deleteBusScheduleUsecase,
  getBusScheduleByIdUsecase,
  updateBusScheduleUsecase,
  getAllBusSchedulesUsecase
);

// Create an Express router
export const busScheduleRouter = Router();

// Route handling for creating a new busSchedule
busScheduleRouter.post("/", validateBusScheduleInputMiddleware(false), busScheduleService.createBusSchedule.bind(busScheduleService));

// Route handling for getting all busSchedules
busScheduleRouter.get("/", busScheduleService.getAllBusSchedules.bind(busScheduleService));

// Route handling for getting an busSchedule by ID
busScheduleRouter.get("/:busScheduleId", busScheduleService.getBusScheduleById.bind(busScheduleService));

// Route handling for updating an busSchedule by ID
busScheduleRouter.put("/:busScheduleId", validateBusScheduleInputMiddleware(true), busScheduleService.updateBusSchedule.bind(busScheduleService));

// Route handling for deleting an busSchedule by ID
busScheduleRouter.delete("/:busScheduleId", busScheduleService.deleteBusSchedule.bind(busScheduleService));
