import { UserModel, UserEntity } from "@domain/user/entities/user";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UserRepository {
  createUser(User: UserModel): Promise<Either<ErrorClass, UserEntity>>;
  deleteUser(id: string): Promise<Either<ErrorClass, void>>;
  updateUser(id: string, data: UserModel): Promise<Either<ErrorClass, UserEntity>>;
  getUsers(query: object): Promise<Either<ErrorClass, UserEntity[]>>;
  getUserById(id: string): Promise<Either<ErrorClass, UserEntity | null>>;
  login(email: string, password: string): Promise<any>;
  logout(): Promise<any>;
}

