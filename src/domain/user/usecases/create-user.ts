import { UserModel, UserEntity } from "@domain/user/entities/user";
import { UserRepository } from "@domain/user/repositories/user-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateUserUsecase {
  execute: (userData: UserModel) => Promise<Either<ErrorClass, UserEntity>>;
}

export class CreateUser implements CreateUserUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: UserModel): Promise<Either<ErrorClass, UserEntity>> {
    return await this.userRepository.createUser(userData);
  }
}
