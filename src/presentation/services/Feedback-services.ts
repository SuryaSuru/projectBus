import { NextFunction, Request, Response } from "express";
import {
  FeedbackModel,
  FeedbackEntity,
  FeedbackMapper,
} from "@domain/Feedback/entities/Feedback";
import { CreateFeedbackUsecase } from "@domain/Feedback/usecases/create-Feedback";
import { DeleteFeedbackUsecase } from "@domain/Feedback/usecases/delete-Feedback";
import { GetFeedbackByIdUsecase } from "@domain/Feedback/usecases/get-Feedback-by-id";
import { UpdateFeedbackUsecase } from "@domain/Feedback/usecases/update-Feedback";
import { GetAllfeedbackesUsecase } from "@domain/Feedback/usecases/get-all-Feedbacks";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class feedbackeservice {
  private readonly createFeedbackUsecase: CreateFeedbackUsecase;
  private readonly deleteFeedbackUsecase: DeleteFeedbackUsecase;
  private readonly getFeedbackByIdUsecase: GetFeedbackByIdUsecase;
  private readonly updateFeedbackUsecase: UpdateFeedbackUsecase;
  private readonly getAllfeedbackesUsecase: GetAllfeedbackesUsecase;

  constructor(
    createFeedbackUsecase: CreateFeedbackUsecase,
    deleteFeedbackUsecase: DeleteFeedbackUsecase,
    getFeedbackByIdUsecase: GetFeedbackByIdUsecase,
    updateFeedbackUsecase: UpdateFeedbackUsecase,
    getAllfeedbackesUsecase: GetAllfeedbackesUsecase
  ) {
    this.createFeedbackUsecase = createFeedbackUsecase;
    this.deleteFeedbackUsecase = deleteFeedbackUsecase;
    this.getFeedbackByIdUsecase = getFeedbackByIdUsecase;
    this.updateFeedbackUsecase = updateFeedbackUsecase;
    this.getAllfeedbackesUsecase = getAllfeedbackesUsecase;
  }

  async createFeedback(req: Request, res: Response): Promise<void> {
      
      // Extract feedback data from the request body and convert it to FeedbackModel
      const feedbackData: FeedbackModel = FeedbackMapper.toModel(req.body);
      console.log("feedbackData--->", feedbackData);
      

      // Call the createFeedbackUsecase to create the feedback
      const newFeedback: Either<ErrorClass, FeedbackEntity> = await this.createFeedbackUsecase.execute(
        feedbackData
      );
      console.log("newFeedback--->", newFeedback);

      newFeedback.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: FeedbackEntity) =>{
          const responseData = FeedbackMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteFeedback(req: Request, res: Response): Promise<void> {
    const feedbackId: string = req.params.feedbackId;

    // Call the DeleteFeedbackUsecase to delete the feedback
    const deletedFeedback: Either<ErrorClass, void> = await this.deleteFeedbackUsecase.execute(feedbackId);

    deletedFeedback.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Feedback deleted successfully' });
        }
    );
}

  async getFeedbackById(req: Request, res: Response): Promise<void> {
    const feedbackId: string = req.params.feedbackId;
    console.log("feedbackId--->", feedbackId);
    

    // Call the GetFeedbackByIdUsecase to get the Feedback by ID
    const feedback: Either<ErrorClass, FeedbackEntity | null> = await this.getFeedbackByIdUsecase.execute(
      feedbackId
    );
    
    console.log("feedback--->", feedback);

    feedback.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: FeedbackEntity | null) =>{
        const responseData = FeedbackMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateFeedback(req: Request, res: Response): Promise<void> {
    
      const feedbackId: string = req.params.feedbackId;
      const feedbackData: FeedbackModel = req.body;

      // Get the existing feedback by ID
      const existingFeedback: Either<ErrorClass, FeedbackEntity | null> =
        await this.getFeedbackByIdUsecase.execute(feedbackId);

      if (!existingFeedback) {
        // If feedback is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert feedbackData from FeedbackModel to FeedbackEntity using FeedbackMapper
      const updatedFeedbackEntity: FeedbackEntity = FeedbackMapper.toEntity(
        feedbackData,
        true,
      );

      // Call the UpdateFeedbackUsecase to update the feedback
      const updatedFeedback: Either<ErrorClass, FeedbackEntity> = await this.updateFeedbackUsecase.execute(
        feedbackId,
        updatedFeedbackEntity
      );

      updatedFeedback.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: FeedbackEntity) =>{
          const responseData = FeedbackMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllFeedbacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllFeedbacksUsecase to get all feedbacks
    const feedbacks: Either<ErrorClass, FeedbackEntity[]> = await this.getAllfeedbackesUsecase.execute();
  
    feedbacks.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: FeedbackEntity[]) => {
        return res.json(result);
      }
    );
  }

}
