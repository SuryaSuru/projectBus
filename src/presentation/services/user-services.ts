import { NextFunction, Request, Response } from "express";
import {
  UserModel,
  UserEntity,
  UserMapper,
} from "@domain/user/entities/user";
import { CreateUserUsecase } from "@domain/user/usecases/create-user";
import { DeleteUserUsecase } from "@domain/user/usecases/delete-user";
import { GetUserByIdUsecase } from "@domain/user/usecases/get-user-by-id";
import { UpdateUserUsecase } from "@domain/user/usecases/update-user";
import { GetAllUsersUsecase } from "@domain/user/usecases/get-all-users";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class UserService {
  private readonly createUserUsecase: CreateUserUsecase;
  private readonly deleteUserUsecase: DeleteUserUsecase;
  private readonly getUserByIdUsecase: GetUserByIdUsecase;
  private readonly updateUserUsecase: UpdateUserUsecase;
  private readonly getAllUsersUsecase: GetAllUsersUsecase;

  constructor(
    createUserUsecase: CreateUserUsecase,
    deleteUserUsecase: DeleteUserUsecase,
    getUserByIdUsecase: GetUserByIdUsecase,
    updateUserUsecase: UpdateUserUsecase,
    getAllUsersUsecase: GetAllUsersUsecase,
  ) {
    this.createUserUsecase = createUserUsecase;
    this.deleteUserUsecase = deleteUserUsecase;
    this.getUserByIdUsecase = getUserByIdUsecase;
    this.updateUserUsecase = updateUserUsecase;
    this.getAllUsersUsecase = getAllUsersUsecase;
  }

  async createUser(req: Request, res: Response): Promise<void> {

    // Extract user data from the request body and convert it to UserModel
    const userData: UserModel = UserMapper.toModel(req.body);
    console.log("userData--->", userData);


    // Call the createUserUsecase to create the user
    const newUser: Either<ErrorClass, UserEntity> = await this.createUserUsecase.execute(
      userData
    );

    newUser.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UserEntity) => {
        const responseData = UserMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
  }

  async deleteUser(req: Request, res: Response): Promise<void> {

    const userId: string = req.params.userId;


    const updatedUserEntity: UserEntity = UserMapper.toEntity(
      { disabled: true },
      true
    );

    // Call the UpdateUserUsecase to update the user
    const updatedUser: Either<ErrorClass, UserEntity> = await this.updateUserUsecase.execute(
      userId,
      updatedUserEntity
    );

    updatedUser.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UserEntity) => {
        const responseData = UserMapper.toModel(result);
        return res.json(responseData)
      }
    )
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;

    // Call the GetUserByIdUsecase to get the user by ID
    const user: Either<ErrorClass, UserEntity | null> = await this.getUserByIdUsecase.execute(
      userId
    );

    user.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UserEntity | null) => {
        const responseData = UserMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
  }

  async updateUser(req: Request, res: Response): Promise<void> {

    const userId: string = req.params.userId;
    const userData: UserModel = req.body;

    // Get the existing user by ID
    const existingUser: Either<ErrorClass, UserEntity | null> =
      await this.getUserByIdUsecase.execute(userId);

    if (!existingUser) {
      // If user is not found, send a not found message as a JSON response
      ApiError.notFound();
      return;
    }


    // Convert userData from UserModel to UserEntity using UserMapper
    const updatedUserEntity: UserEntity = UserMapper.toEntity(
      userData,
      true,
    );

    // Call the UpdateUserUsecase to update the user
    const updatedUser: Either<ErrorClass, UserEntity> = await this.updateUserUsecase.execute(
      userId,
      updatedUserEntity
    );

    updatedUser.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UserEntity) => {
        const responseData = UserMapper.toModel(result);
        return res.json(responseData)
      }
    )
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query: any = {};
    query.search = req.query.search as string;

    // Call the GetAllUsersUsecase to get all users
    const users: Either<ErrorClass, UserEntity[]> = await this.getAllUsersUsecase.execute(query);

    users.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: UserEntity[]) => {
        // Filter out users with disabled set to "Deleted"
        const nonDeletedUsers = result.filter((user) => user.disabled !== true);

        // Convert non-deleted users from an array of UserEntity to an array of plain JSON objects using UserMapper
        const responseData = nonDeletedUsers.map((user) => UserMapper.toEntity(user));
        return res.json(responseData);
      }
    );
  }
}
