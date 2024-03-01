import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdateFeedbackUsecase {
  execute: (
    feedbackId: string,
    feedbackData: FeedbackModel
  ) => Promise<Either<ErrorClass, FeedbackEntity>>;
}

export class UpdateFeedback implements UpdateFeedbackUsecase {
  private readonly feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }
  async execute(feedbackId: string, feedbackData: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>> {
   return await this.feedbackRepository.updateFeedback(feedbackId, feedbackData);
 }
}
