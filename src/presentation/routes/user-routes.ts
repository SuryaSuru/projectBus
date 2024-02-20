// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { UserService } from "@presentation/services/user-services";
import { UserDataSourceImpl } from "@data/user/datasource/user-data-source";
import { UserRepositoryImpl } from "@data/user/repositories/user-repository-impl";
import { CreateUser } from "@domain/user/usecases/create-user";
import { DeleteUser } from "@domain/user/usecases/delete-user";
import { GetUserById } from "@domain/user/usecases/get-user-by-id";
import { GetAllUsers } from "@domain/user/usecases/get-all-users";
import { UpdateUser } from "@domain/user/usecases/update-user";
import { validateUserInputMiddleware } from "@presentation/middlewares/user/validation-middleware";

// Create an instance of the UserDataSourceImpl and pass the mongoose connection
const userDataSource = new UserDataSourceImpl(mongoose.connection);

// Create an instance of the UserRepositoryImpl and pass the UserDataSourceImpl
const userRepository = new UserRepositoryImpl(userDataSource);

// Create instances of the required use cases and pass the UserRepositoryImpl
const createUserUsecase = new CreateUser(userRepository);
const deleteUserUsecase = new DeleteUser(userRepository);
const getUserByIdUsecase = new GetUserById(userRepository);
const updateUserUsecase = new UpdateUser(userRepository);
const getAllUsersUsecase = new GetAllUsers(userRepository);

// Initialize UserService and inject required dependencies
const userService = new UserService(
  createUserUsecase,
  deleteUserUsecase,
  getUserByIdUsecase,
  updateUserUsecase,
  getAllUsersUsecase,
);

// Create an Express router
export const userRouter = Router();

// Route handling for creating a new user
userRouter.post("/", validateUserInputMiddleware(false), userService.createUser.bind(userService));

// Route handling for getting all users
userRouter.get("/", userService.getAllUsers.bind(userService));

// Route handling for getting an user by ID
userRouter.get("/:userId", userService.getUserById.bind(userService));

// Route handling for updating an user by ID
userRouter.put("/:userId", validateUserInputMiddleware(true), userService.updateUser.bind(userService));

// Route handling for deleting an user by ID
userRouter.delete("/:userId", userService.deleteUser.bind(userService));