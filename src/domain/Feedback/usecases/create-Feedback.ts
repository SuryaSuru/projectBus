import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateFeedbackUsecase {
  execute: (feedbackData: FeedbackModel) => Promise<Either<ErrorClass, FeedbackEntity>>;
}

export class CreateFeedback implements CreateFeedbackUsecase {
  private readonly feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async execute(feedbackData: FeedbackModel): Promise<Either<ErrorClass, FeedbackEntity>> {
    return await this.feedbackRepository.createFeedback(feedbackData);
  }
}
