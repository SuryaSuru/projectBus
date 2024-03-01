import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository"; 
import { FeedbackDataSource } from "@data/Feedback/datasource/Feedback-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class FeedbackRepositoryImpl implements FeedbackRepository {
  private readonly dataSource: FeedbackDataSource;

  constructor(dataSource: FeedbackDataSource) {
    this.dataSource = dataSource;
  }

  async createFeedback(feedback: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>> {
    // return await this.dataSource.create(feedback);
    try {
      let i = await this.dataSource.create(feedback);
      return Right<ErrorClass, FeedbackEntity>(i);
    } catch (e) {
      // if(e instanceof ApiError && e.name === "feedbackNumber_conflict"){
      //   return Left<ErrorClass, FeedbackEntity>(ApiError.feedbackNumberExits());
      // }
      return Left<ErrorClass, FeedbackEntity>(ApiError.badRequest());
    }
  }

  async deleteFeedback(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updateFeedback(id: string, data: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, FeedbackEntity>(i);
    } catch {
      return Left<ErrorClass, FeedbackEntity>(ApiError.badRequest());
    }
  }

  async getfeedbacks(): Promise<Either<ErrorClass, FeedbackEntity[]>> {
    // return await this.dataSource.getAllfeedbackes();
    try {
      let i = await this.dataSource.getAllfeedbackes();
      return Right<ErrorClass, FeedbackEntity[]>(i);
    } catch {
      return Left<ErrorClass, FeedbackEntity[]>(ApiError.badRequest());
    }
  }

  async getFeedbackById(id: string): Promise<Either<ErrorClass, FeedbackEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, FeedbackEntity | null>(i);
    } catch {
      return Left<ErrorClass, FeedbackEntity | null>(ApiError.badRequest());
    }
  }
}
