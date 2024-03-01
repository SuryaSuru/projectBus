import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface FeedbackRepository {
  createFeedback(Feedback: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>>;
  deleteFeedback(id: string): Promise<Either<ErrorClass, void>>;
  updateFeedback(id: string, data: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>>;
  getfeedbacks(): Promise<Either<ErrorClass, FeedbackEntity[]>>;
  getFeedbackById(id: string): Promise<Either<ErrorClass, FeedbackEntity | null>>;
}

