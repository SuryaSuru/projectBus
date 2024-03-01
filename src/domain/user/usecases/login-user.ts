import { UserEntity, UserModel, LoginModel } from "@domain/user/entities/user";
import { UserRepository } from "@domain/user/repositories/user-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface LoginUserUsecase {
  execute: (email: string, password: string) => Promise<any>;
}

export class LoginUser implements LoginUserUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    email:string,
    password:string
  ): Promise<any> {
    
    return await this.userRepository.login(email, password);
  }
}
