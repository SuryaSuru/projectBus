// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { buseservice as BusServiceClass } from "@presentation/services/bus-services"; // Rename the import
import { BusDataSourceImpl } from "@data/bus/datasource/bus-data-source";
import { BusRepositoryImpl } from "@data/bus/repositories/bus-repository-impl";
import { CreateBus } from "@domain/bus/usecases/create-bus";
import { DeleteBus } from "@domain/bus/usecases/delete-bus";
import { GetBusById } from "@domain/bus/usecases/get-bus-by-id";
import { GetAllbuses } from "@domain/bus/usecases/get-all-buses";
import { UpdateBus } from "@domain/bus/usecases/update-bus";
import { validateBusInputMiddleware } from "@presentation/middlewares/bus/validation-middleware";

// Create an instance of the BusDataSourceImpl and pass the mongoose connection
const busDataSource = new BusDataSourceImpl(mongoose.connection);

// Create an instance of the BusRepositoryImpl and pass the BusDataSourceImpl
const busRepository = new BusRepositoryImpl(busDataSource);

// Create instances of the required use cases and pass the BusRepositoryImpl
const createBusUsecase = new CreateBus(busRepository);
const deleteBusUsecase = new DeleteBus(busRepository);
const getBusByIdUsecase = new GetBusById(busRepository);
const updateBusUsecase = new UpdateBus(busRepository);
const getAllbusesUsecase = new GetAllbuses(busRepository);

// Initialize buseservice and inject required dependencies
const buseservice = new BusServiceClass(
  createBusUsecase,
  deleteBusUsecase,
  getBusByIdUsecase,
  updateBusUsecase,
  getAllbusesUsecase
);

// Create an Express router
export const busRouter = Router();

// Route handling for creating a new bus
busRouter.post("/", validateBusInputMiddleware(false), buseservice.createBus.bind(buseservice));

// Route handling for getting all buses
busRouter.get("/", buseservice.getAllbuses.bind(buseservice));

// Route handling for getting an bus by ID
busRouter.get("/:busId", buseservice.getBusById.bind(buseservice));

// Route handling for updating an bus by ID
busRouter.put("/:busId", validateBusInputMiddleware(true), buseservice.updateBus.bind(buseservice));

// Route handling for deleting an bus by ID
busRouter.delete("/:busId", buseservice.deleteBus.bind(buseservice));
