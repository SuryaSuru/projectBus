import {type FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeleteFeedbackUsecase {
  execute: (feedbackId: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteFeedback implements DeleteFeedbackUsecase {
  private readonly feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async execute(feedbackId: string): Promise<Either<ErrorClass, void>> {
    return await this.feedbackRepository.deleteFeedback(feedbackId);
  }
}
