import { UserModel } from "@domain/user/entities/user";
import { User } from "../models/user-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface UserDataSource {
  create(user: UserModel): Promise<any>; // Return type should be Promise of UserEntity
  update(id: string, user: UserModel): Promise<any>; // Return type should be Promise of UserEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of UserEntity or null
  getAllUsers(): Promise<any[]>; // Return type should be Promise of an array of UserEntity
}

export class UserDataSourceImpl implements UserDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(user: UserModel): Promise<any> {

      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        throw ApiError.emailExits()
      }

      const userData = new User(user);

      const createdUser = await userData.save();

      return createdUser.toObject();
    }

  async update(id: string, user: UserModel): Promise<any> {
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    }); // No need for conversion here
    return updatedUser ? updatedUser.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const user = await User.findById(id);
    return user ? user.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllUsers(): Promise<any[]> {
    const users = await User.find();
    return users.map((user) => user.toObject());
  }
}

