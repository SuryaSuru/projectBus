import { UserModel, UserEntity } from "@domain/user/entities/user";
import { UserRepository } from "@domain/user/repositories/user-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetUserByIdUsecase {
  execute: (userId: string) => Promise<Either<ErrorClass, UserEntity | null>>;
}

export class GetUserById implements GetUserByIdUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<Either<ErrorClass, UserEntity | null>> {
    return await this.userRepository.getUserById(userId);
  }
}
