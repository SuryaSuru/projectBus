import {type UserRepository } from "@domain/user/repositories/user-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteUserUsecase {
  execute: (userId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteUser implements DeleteUserUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<Either<ErrorClass, void>> {
    return await this.userRepository.deleteUser(userId);
  }
}
