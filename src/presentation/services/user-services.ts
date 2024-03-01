import { NextFunction, Request, Response } from "express";
import {User} from "@data/user/models/user-model"
import bcrypt from "bcrypt";
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
import { LoginUserUsecase } from "@domain/user/usecases/login-user";
import { LogoutUserUsecase } from "@domain/user/usecases/logout-user";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { generateRandomPassword } from "@presentation/middlewares/randomPassword";

export class UserService {
  private readonly createUserUsecase: CreateUserUsecase;
  private readonly deleteUserUsecase: DeleteUserUsecase;
  private readonly getUserByIdUsecase: GetUserByIdUsecase;
  private readonly updateUserUsecase: UpdateUserUsecase;
  private readonly getAllUsersUsecase: GetAllUsersUsecase;
  private readonly loginUserUsecase: LoginUserUsecase;
  private readonly logoutUserUsecase: LogoutUserUsecase;

  constructor(
    createUserUsecase: CreateUserUsecase,
    deleteUserUsecase: DeleteUserUsecase,
    getUserByIdUsecase: GetUserByIdUsecase,
    updateUserUsecase: UpdateUserUsecase,
    getAllUsersUsecase: GetAllUsersUsecase,
    loginUserUsecase: LoginUserUsecase,
    logoutUserUsecase: LogoutUserUsecase
  ) {
    this.createUserUsecase = createUserUsecase;
    this.deleteUserUsecase = deleteUserUsecase;
    this.getUserByIdUsecase = getUserByIdUsecase;
    this.updateUserUsecase = updateUserUsecase;
    this.getAllUsersUsecase = getAllUsersUsecase;
    this.loginUserUsecase = loginUserUsecase;
    this.logoutUserUsecase = logoutUserUsecase;
  }

  async createUser(req: Request, res: Response): Promise<void> {

    const randomPassword = generateRandomPassword(5)

    req.body.password = randomPassword;

    const userData: UserModel = UserMapper.toModel(req.body);
    
    const newUser: Either<ErrorClass, UserEntity> =
      await this.createUserUsecase.execute(userData);
    
    newUser.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UserEntity) => {
        const resData = UserMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
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

  async getAllUsers(req: Request, res: Response, next:NextFunction): Promise<void> {
    const query: any = {};
    query.search = req.query.search as string;

    // Call the GetAllUsersUsecase to get all users
    const users: Either<ErrorClass, UserEntity[]> = await this.getAllUsersUsecase.execute(query);
  
    users.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: UserEntity[]) => {
        // Filter out tables with del_status set to "Deleted"
        const nonDeletedUser = result.filter((user) => user.disabled !== true);
  
        // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
        const responseData = nonDeletedUser.map((User) => UserMapper.toEntity(User));
        return res.json(responseData);
      }
    )
  }
  
  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const userResult: Either<ErrorClass, any> =
      await this.loginUserUsecase.execute(email, password);

    userResult.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (user: any) => {
        // const isMatch = await user.matchPassword(password); // You should define the matchPassword method in UserEntity
        const isMatch = await user.password;
        console.log("isMatch--->", isMatch);
        
        if (!isMatch) {
          const err = ApiError.forbidden();
          return res.status(err.status).json(err.message);
        }

        const token = await user.generateToken();
        console.log("token--->", token);
        const options = {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        console.log("options--->", options);

        const resData = { user: UserMapper.toEntity(user, true) };
        console.log("resData--->", resData);
        res.cookie("token", token, options).json(resData);
      }
    );
  }

  async logoutUser(req: Request, res: Response): Promise<void> {

    console.log("token");
    // await this.logoutUserUsecase.execute();
    // Clear the token from the cookies
    res.clearCookie("token");
    
    
    // Send a success response indicating the user has been logged out
    res.status(200).json({ message: "User logged out successfully" });
}
  
}
