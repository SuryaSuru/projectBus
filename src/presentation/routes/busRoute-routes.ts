// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { BusRouteService } from "@presentation/services/busRoute-services";
import { BusRouteDataSourceImpl } from "@data/busRoute/datasource/busRoute-data-source";
import { BusRouteRepositoryImpl } from "@data/busRoute/repositories/busRoute-repository-impl";
import { CreateBusRoute } from "@domain/busRoute/usecases/create-busRoute";
import { DeleteBusRoute } from "@domain/busRoute/usecases/delete-busRoute";
import { GetBusRouteById } from "@domain/busRoute/usecases/get-busRoute-by-id";
import { GetAllBusRoutes } from "@domain/busRoute/usecases/get-all-busRoutes";
import { UpdateBusRoute } from "@domain/busRoute/usecases/update-busRoute";
import { validateBusRouteInputMiddleware } from "@presentation/middlewares/busRoute/validation-middleware";

// Create an instance of the BusRouteDataSourceImpl and pass the mongoose connection
const busRouteDataSource = new BusRouteDataSourceImpl(mongoose.connection);

// Create an instance of the BusRouteRepositoryImpl and pass the BusRouteDataSourceImpl
const busRouteRepository = new BusRouteRepositoryImpl(busRouteDataSource);

// Create instances of the required use cases and pass the BusRouteRepositoryImpl
const createBusRouteUsecase = new CreateBusRoute(busRouteRepository);
const deleteBusRouteUsecase = new DeleteBusRoute(busRouteRepository);
const getBusRouteByIdUsecase = new GetBusRouteById(busRouteRepository);
const updateBusRouteUsecase = new UpdateBusRoute(busRouteRepository);
const getAllBusRoutesUsecase = new GetAllBusRoutes(busRouteRepository);

// Initialize BusRouteService and inject required dependencies
const busRouteService = new BusRouteService(
  createBusRouteUsecase,
  deleteBusRouteUsecase,
  getBusRouteByIdUsecase,
  updateBusRouteUsecase,
  getAllBusRoutesUsecase
);

// Create an Express router
export const busRouteRouter = Router();

// Route handling for creating a new busRoute
busRouteRouter.post("/", validateBusRouteInputMiddleware(false), busRouteService.createBusRoute.bind(busRouteService));

// Route handling for getting all busRoutes
busRouteRouter.get("/", busRouteService.getAllBusRoutes.bind(busRouteService));

// Route handling for getting an busRoute by ID
busRouteRouter.get("/:busRouteId", busRouteService.getBusRouteById.bind(busRouteService));

// Route handling for updating an busRoute by ID
busRouteRouter.put("/:busRouteId", validateBusRouteInputMiddleware(true), busRouteService.updateBusRoute.bind(busRouteService));

// Route handling for deleting an busRoute by ID
busRouteRouter.delete("/:busRouteId", busRouteService.deleteBusRoute.bind(busRouteService));
