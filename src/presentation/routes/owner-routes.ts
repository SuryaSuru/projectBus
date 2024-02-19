// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { OwnerService } from "@presentation/services/owner-services";
import { OwnerDataSourceImpl } from "@data/owner/datasource/owner-data-source";
import { OwnerRepositoryImpl } from "@data/owner/repositories/owner-repository-impl";
import { CreateOwner } from "@domain/owner/usecases/create-owner";
import { DeleteOwner } from "@domain/owner/usecases/delete-owner";
import { GetOwnerById } from "@domain/owner/usecases/get-owner-by-id";
import { GetAllOwners } from "@domain/owner/usecases/get-all-owners";
import { UpdateOwner } from "@domain/owner/usecases/update-owner";
import { validateOwnerInputMiddleware } from "@presentation/middlewares/owner/validation-middleware";

// Create an instance of the OwnerDataSourceImpl and pass the mongoose connection
const ownerDataSource = new OwnerDataSourceImpl(mongoose.connection);

// Create an instance of the OwnerRepositoryImpl and pass the OwnerDataSourceImpl
const ownerRepository = new OwnerRepositoryImpl(ownerDataSource);

// Create instances of the required use cases and pass the OwnerRepositoryImpl
const createOwnerUsecase = new CreateOwner(ownerRepository);
const deleteOwnerUsecase = new DeleteOwner(ownerRepository);
const getOwnerByIdUsecase = new GetOwnerById(ownerRepository);
const updateOwnerUsecase = new UpdateOwner(ownerRepository);
const getAllOwnersUsecase = new GetAllOwners(ownerRepository);

// Initialize OwnerService and inject required dependencies
const ownerService = new OwnerService(
  createOwnerUsecase,
  deleteOwnerUsecase,
  getOwnerByIdUsecase,
  updateOwnerUsecase,
  getAllOwnersUsecase
);

// Create an Express router
export const ownerRouter = Router();

// Route handling for creating a new owner
ownerRouter.post("/", validateOwnerInputMiddleware(false), ownerService.createOwner.bind(ownerService));

// Route handling for getting all owners
ownerRouter.get("/", ownerService.getAllOwners.bind(ownerService));

// Route handling for getting an owner by ID
ownerRouter.get("/:ownerId", ownerService.getOwnerById.bind(ownerService));

// Route handling for updating an owner by ID
ownerRouter.put("/:ownerId", validateOwnerInputMiddleware(true), ownerService.updateOwner.bind(ownerService));

// Route handling for deleting an owner by ID
ownerRouter.delete("/:ownerId", ownerService.deleteOwner.bind(ownerService));
