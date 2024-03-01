import { UserModel } from "@domain/user/entities/user";
import { User } from "../models/user-model";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer"; 
import ApiError from "@presentation/error-handling/api-error";

export class InvitationApp {
  private app: express.Application;
  private transporter: nodemailer.Transporter;
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    // Nodemailer configuration
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      // rutuja.dhekolkar@furation.tech  , mkfregktqnmykao
      auth: {
          user: 'suryaumpteen@gmail.com',
          pass: 'egye onio jxeo rhmt',
      },
    });
    // this.app.post('/send-invitation', this.sendInvitation.bind(this));
  }
  public sendInvitation(
    email: string,
    firstName: string,
    password: string
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'suryaumpteen@gmail.com',
      to: email,
      subject: "Invitation to Join ",
      headers: {
        "Content-Type": "text/html",
      },
      // text: `You have been invited to join the group ${companyName}. Click the link to join: https://example.com/groups/${companyName}`
      html: `
      <p>Dear ${firstName},</p>
      <p>We are thrilled to extend to you an invitation to join our esteemed community at [Your Bus Website Name]. Your expertise and contributions are highly valued, and we believe your presence will further enrich our team.</p>
      <p><strong>Invitation Details:</strong></p>
      <p><strong>Company:</strong> [Your Bus Website Name]<br>Invitation Link: <a href="[Your Invitation Link]">Click Here</a></p>
      <p>By clicking the link above, you will be directed to the platform where you can seamlessly join our organization and begin collaborating with like-minded professionals.</p>
      <p><strong>Login Credentials:</strong> <br> <strong>Email :</strong> ${email} <br> <strong>Password:</strong> ${password} </p>
      <p>Should you have any questions or require assistance during the registration process, please don't hesitate to contact our support team at <a href="mailto:hello@[Your Bus Website Domain]">hello@[Your Bus Website Domain]</a>.</p>
      <p>We eagerly await your participation and look forward to welcoming you aboard.</p>
      <p><strong>Best regards,</strong><br>[Your Bus Website Name]</p>
`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending invitation email:", error);
          reject(error);
        } else {
          console.log("Invitation email sent:", info.response);
          resolve();
        }
      });
    });
  }
}

export interface UserDataSource {
  create(user: UserModel): Promise<any>; // Promise<UserModel>
  update(id: string, user: UserModel): Promise<any>; // Promise<UserModel | null>
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Promise<UserModel | null>
  getAllUsers(query: UserQuery): Promise<any[]>; // Promise<UserModel[]>
  login(email: string, password: string): Promise<any>;
  logout(): Promise<any>;
}

export interface UserQuery {
  search?: string; // Change ownerId to search
}

export class UserDataSourceImpl implements UserDataSource {
  constructor(
    private db: mongoose.Connection,
    private invitationApp: InvitationApp
  ) {}

  async create(user: UserModel): Promise<any> {
    const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw ApiError.emailExits();
  }

  const userData = new User(user);

  const createdUser = await userData.save();

  await this.invitationApp.sendInvitation(
    user.email,
    // "Bus ki Webiste",
    // user.userName,
    user.firstName,
    user.password
  );
  
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

  async getAllUsers(query: UserQuery): Promise<any[]> {
    const filter: any = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { userId: searchRegex },
        { userName: searchRegex },
        { type: searchRegex },
        { email: searchRegex }
      ];
    }

    const users = await User.find(filter);
    return users.map((user) => user.toObject());
  }
  
  async login(email: string, password: string): Promise<any> {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw ApiError.userNotFound();
    }
    return user;
  }

  logout(): Promise<void> {
    console.log("asdsad");
    
    throw new Error("Logout method not implemented");
  }
}
