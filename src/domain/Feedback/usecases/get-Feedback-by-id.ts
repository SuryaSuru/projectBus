import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetFeedbackByIdUsecase {
  execute: (feedbackId: string) => Promise<Either<ErrorClass, FeedbackEntity | null>>;
}

export class GetFeedbackById implements GetFeedbackByIdUsecase {
  private readonly feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async execute(feedbackId: string): Promise<Either<ErrorClass, FeedbackEntity | null>> {
    return await this.feedbackRepository.getFeedbackById(feedbackId);
  }
}
