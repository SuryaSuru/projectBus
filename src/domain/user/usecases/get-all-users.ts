import { UserModel, UserEntity } from "@domain/user/entities/user";
import { UserRepository } from "@domain/user/repositories/user-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllUsersUsecase {
  execute: () => Promise<Either<ErrorClass, UserEntity[]>>;
}

export class GetAllUsers implements GetAllUsersUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<Either<ErrorClass, UserEntity[]>> {
    return await this.userRepository.getUsers();
  }
}
