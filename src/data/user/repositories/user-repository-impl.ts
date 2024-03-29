import { UserModel, UserEntity } from "@domain/user/entities/user";
import { UserRepository } from "@domain/user/repositories/user-repository"; 
import { UserDataSource, UserQuery } from "@data/user/datasource/user-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class UserRepositoryImpl implements UserRepository {
  private readonly dataSource: UserDataSource;

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource;
  }

  async createUser(user: UserModel): Promise<Either<ErrorClass, UserEntity>> {
    // return await this.dataSource.create(user);
    try {
      let i = await this.dataSource.create(user);
      return Right<ErrorClass, UserEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "email_conflict"){
        return Left<ErrorClass, UserEntity>(ApiError.emailExits());
      }
      return Left<ErrorClass, UserEntity>(ApiError.badRequest());
    }
  }

  async deleteUser(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateUser(id: string, data: UserModel): Promise<Either<ErrorClass, UserEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, UserEntity>(i);
    } catch {
      return Left<ErrorClass, UserEntity>(ApiError.badRequest());
    }
  }

  async getUsers(query: UserQuery): Promise<Either<ErrorClass, UserEntity[]>> {
    // return await this.dataSource.getAllUsers();
    try {
      let i = await this.dataSource.getAllUsers(query);
      return Right<ErrorClass, UserEntity[]>(i);
    } catch {
      return Left<ErrorClass, UserEntity[]>(ApiError.badRequest());
    }
  }

  async getUserById(id: string): Promise<Either<ErrorClass, UserEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, UserEntity | null>(i);
    } catch {
      return Left<ErrorClass, UserEntity | null>(ApiError.badRequest());
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<Either<ErrorClass, UserEntity>> {
    try {
      const res = await this.dataSource.login(email, password);

      return Right<ErrorClass, UserEntity>(res);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, UserEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, UserEntity>(ApiError.badRequest());
    }
  }

  async logout(): Promise<Either<ErrorClass, string>> {
    console.log("1243qe3432");
    
    try {
      const res = await this.dataSource.logout();
      return Right<ErrorClass, string>("Logged Out");
    } catch (error) {
      if (error instanceof ApiError) {
        return Left<ErrorClass, string>(error); 
      }
      return Left<ErrorClass, string>(
        ApiError.customError(500, "Logout Failed")
      ); 
    }
  }
}
