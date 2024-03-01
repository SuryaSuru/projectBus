import {
    UserEntity,
    UserModel,
    LoginModel,
  } from "@domain/user/entities/user";
  import { UserRepository } from "@domain/user/repositories/user-repository";
  import { ErrorClass } from "@presentation/error-handling/api-error";
  import { Either } from "monet";
  
  export interface LogoutUserUsecase {
    execute: () => Promise<any>;
  }
  
  export class LogoutUser implements LogoutUserUsecase {
    private readonly userRepository: UserRepository;
  
    constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(): Promise<void> {
      console.log("wqedsad");
      await this.userRepository.logout();
      
    }
  }
  