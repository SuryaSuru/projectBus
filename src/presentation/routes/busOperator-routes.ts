// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { BusOperatorService } from "@presentation/services/busOperator-services";
import { BusOperatorDataSourceImpl } from "@data/busOperator/datasource/busOperator-data-source";
import { BusOperatorRepositoryImpl } from "@data/busOperator/repositories/busOperator-repository-impl";
import { CreateBusOperator } from "@domain/busOperator/usecases/create-busOperator";
import { DeleteBusOperator } from "@domain/busOperator/usecases/delete-busOperator";
import { GetBusOperatorById } from "@domain/busOperator/usecases/get-busOperator-by-id";
import { GetAllBusOperators } from "@domain/busOperator/usecases/get-all-busOperators";
import { UpdateBusOperator } from "@domain/busOperator/usecases/update-busOperator";
import { validateBusOperatorInputMiddleware } from "@presentation/middlewares/busOperator/validation-middleware";

// Create an instance of the BusOperatorDataSourceImpl and pass the mongoose connection
const busOperatorDataSource = new BusOperatorDataSourceImpl(mongoose.connection);

// Create an instance of the BusOperatorRepositoryImpl and pass the BusOperatorDataSourceImpl
const busOperatorRepository = new BusOperatorRepositoryImpl(busOperatorDataSource);

// Create instances of the required use cases and pass the BusOperatorRepositoryImpl
const createBusOperatorUsecase = new CreateBusOperator(busOperatorRepository);
const deleteBusOperatorUsecase = new DeleteBusOperator(busOperatorRepository);
const getBusOperatorByIdUsecase = new GetBusOperatorById(busOperatorRepository);
const updateBusOperatorUsecase = new UpdateBusOperator(busOperatorRepository);
const getAllBusOperatorsUsecase = new GetAllBusOperators(busOperatorRepository);

// Initialize BusOperatorService and inject required dependencies
const busOperatorService = new BusOperatorService(
  createBusOperatorUsecase,
  deleteBusOperatorUsecase,
  getBusOperatorByIdUsecase,
  updateBusOperatorUsecase,
  getAllBusOperatorsUsecase
);

// Create an Express router
export const busOperatorRouter = Router();

// Route handling for creating a new busOperator
busOperatorRouter.post("/", validateBusOperatorInputMiddleware(false), busOperatorService.createBusOperator.bind(busOperatorService));

// Route handling for getting all busOperators
busOperatorRouter.get("/", busOperatorService.getAllBusOperators.bind(busOperatorService));

// Route handling for getting an busOperator by ID
busOperatorRouter.get("/:busOperatorId", busOperatorService.getBusOperatorById.bind(busOperatorService));

// Route handling for updating an busOperator by ID
busOperatorRouter.put("/:busOperatorId", validateBusOperatorInputMiddleware(true), busOperatorService.updateBusOperator.bind(busOperatorService));

// Route handling for deleting an busOperator by ID
busOperatorRouter.delete("/:busOperatorId", busOperatorService.deleteBusOperator.bind(busOperatorService));
