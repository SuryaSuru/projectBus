import { OwnerModel } from "@domain/owner/entities/owner";
import { Owner } from "../models/owner-model";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface OwnerDataSource {
  create(owner: OwnerModel): Promise<any>; // Return type should be Promise of OwnerEntity
  update(id: string, owner: OwnerModel): Promise<any>; // Return type should be Promise of OwnerEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of OwnerEntity or null
  getAllOwners(): Promise<any[]>; // Return type should be Promise of an array of OwnerEntity
}

export class OwnerDataSourceImpl implements OwnerDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(owner: OwnerModel): Promise<any> {

      const existingOwner = await Owner.findOne({ ownerName: owner.ownerName });
      if (existingOwner) {
        throw ApiError.emailExits()
      }

      const ownerData = new Owner(owner);

      const createdOwner = await ownerData.save();
  
      // Send email to the owner
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use the name of the email service provider, not your email address
        auth: {
          user: 'suryaumpteen@gmail.com', // Use 'user' instead of 'owner'
          pass: 'egye onio jxeo rhmt',
        },
      });
      
    
      const mailOptions = {
        from: 'suryaumpteen@gmail.com',
        to: owner.email,
        subject: 'Welcome to Our Platform',
        text: `Hello ${owner.ownerName}, thank you for signing up!`,
      };
  
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
        // Handle error properly or log it
      }

      return createdOwner.toObject();
    }

  async update(id: string, owner: OwnerModel): Promise<any> {
    const updatedOwner = await Owner.findByIdAndUpdate(id, owner, {
      new: true,
    }); // No need for conversion here
    return updatedOwner ? updatedOwner.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Owner.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const owner = await Owner.findById(id);
    return owner ? owner.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllOwners(): Promise<any[]> {
    const owners = await Owner.find();
    return owners.map((owner) => owner.toObject());
  }
}

