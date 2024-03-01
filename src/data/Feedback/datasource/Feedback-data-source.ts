import { FeedbackModel } from "@domain/Feedback/entities/Feedback";
import { Feedback } from "../models/Feedback-model";
import mongoose from "mongoose";
import ApiError from "@presentation/error-handling/api-error";
export interface FeedbackDataSource {
  create(feedback: FeedbackModel): Promise<any>; // Return type should be Promise of FeedbackEntity
  update(id: string, feedback: FeedbackModel): Promise<any>; // Return type should be Promise of FeedbackEntity
  delete(id: string): Promise<void>;
  read(id: string): Promise<any | null>; // Return type should be Promise of FeedbackEntity or null
  getAllfeedbackes(): Promise<any[]>; // Return type should be Promise of an array of FeedbackEntity
}

export class FeedbackDataSourceImpl implements FeedbackDataSource {
  constructor(private db: mongoose.Connection) { }

    async create(feedback: FeedbackModel): Promise<any> {

      // const existingFeedback = await Feedback.findOne({ feedbackNumber: feedback.feedbackNumber });
      // if (existingFeedback) {
      //   throw ApiError.feedbackNumberExits()
      // }

      const feedbackData = new Feedback(feedback);

      const createdFeedback = await feedbackData.save();

      return createdFeedback.toObject();
    }
    
  async update(id: string, feedback: FeedbackModel): Promise<any> {
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, feedback, {
      new: true,
    }); // No need for conversion here
    return updatedFeedback ? updatedFeedback.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
    await Feedback.findByIdAndDelete(id);
  }

  async read(id: string): Promise<any | null> {
    const feedback = await Feedback.findById(id)
    return feedback ? feedback.toObject() : null; // Convert to plain JavaScript object before returning
  }

  async getAllfeedbackes(): Promise<any[]> {
    const feedbackes = await Feedback.find();
    return feedbackes.map((feedback) => feedback.toObject());
  }
}

