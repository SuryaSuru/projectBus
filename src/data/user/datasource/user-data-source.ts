import { UserModel } from "@domain/user/entities/user";
import { User } from "../models/user-model";
import mongoose from "mongoose";
import nodemailer from "nodemailer"; 
import ApiError from "@presentation/error-handling/api-error";

export interface UserDataSource {
  create(user: UserModel): Promise<any>; // Promise<UserModel>
  update(id: string, user: UserModel): Promise<any>; // Promise<UserModel | null>
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Promise<UserModel | null>
  getAllUsers(): Promise<any[]>; // Promise<UserModel[]>
}

export class UserDataSourceImpl implements UserDataSource {
  constructor(private db: mongoose.Connection) { }

  async create(user: UserModel): Promise<any> {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw ApiError.emailExits();
    }
  
    const userData = new User(user);
  
    const createdUser = await userData.save();
  
    // Send email to the user
    const transporter = nodemailer.createTransport({
      service: 'suryaumpteen@gmail.com',
      auth: {
        user: 'suryaumpteen@gmail.com',
        pass: 'egye onio jxeo rhmt',
      },
    });
  
    const mailOptions = {
      from: 'suryaumpteen@gmail.com',
      to: user.email,
      subject: 'Welcome to Our Platform',
      text: `Hello ${user.userName}, thank you for signing up!`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle error properly or log it
    }
  
    return createdUser.toObject();
  }

  async update(id: string, user: UserModel): Promise<any> {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser ? updatedUser.toObject() : null;
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const user = await User.findById(id);
    return user ? user.toObject() : null;
  }

  async getAllUsers(): Promise<any[]> {
    const users = await User.find();
    return users.map((user) => user.toObject());
  }
}
