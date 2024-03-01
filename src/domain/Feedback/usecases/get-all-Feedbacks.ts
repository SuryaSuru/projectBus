import { FeedbackModel, FeedbackEntity } from "@domain/Feedback/entities/Feedback";
import { FeedbackRepository } from "@domain/Feedback/repositories/Feedback-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllfeedbackesUsecase {
  execute: () => Promise<Either<ErrorClass, FeedbackEntity[]>>;
}

export class GetAllfeedbackes implements GetAllfeedbackesUsecase {
  private readonly feedbackRepository: FeedbackRepository;

  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async execute(): Promise<Either<ErrorClass, FeedbackEntity[]>> {
    return await this.feedbackRepository.getfeedbacks();
  }
}
