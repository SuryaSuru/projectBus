// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { feedbackeservice as FeedbackServiceClass } from "@presentation/services/Feedback-services"; // Rename the import
import { FeedbackDataSourceImpl } from "@data/Feedback/datasource/Feedback-data-source";
import { FeedbackRepositoryImpl } from "@data/Feedback/repositories/Feedback-repository-impl";
import { CreateFeedback } from "@domain/Feedback/usecases/create-Feedback";
import { DeleteFeedback } from "@domain/Feedback/usecases/delete-Feedback";
import { GetFeedbackById } from "@domain/Feedback/usecases/get-Feedback-by-id";
import { GetAllfeedbackes } from "@domain/Feedback/usecases/get-all-Feedbacks";
import { UpdateFeedback } from "@domain/Feedback/usecases/update-Feedback";
import { validateFeedbackInputMiddleware } from "@presentation/middlewares/Feedback/validation-middleware";

// Create an instance of the FeedbackDataSourceImpl and pass the mongoose connection
const feedbackDataSource = new FeedbackDataSourceImpl(mongoose.connection);

// Create an instance of the FeedbackRepositoryImpl and pass the FeedbackDataSourceImpl
const feedbackRepository = new FeedbackRepositoryImpl(feedbackDataSource);

// Create instances of the required use cases and pass the FeedbackRepositoryImpl
const createFeedbackUsecase = new CreateFeedback(feedbackRepository);
const deleteFeedbackUsecase = new DeleteFeedback(feedbackRepository);
const getFeedbackByIdUsecase = new GetFeedbackById(feedbackRepository);
const updateFeedbackUsecase = new UpdateFeedback(feedbackRepository);
const getAllfeedbackesUsecase = new GetAllfeedbackes(feedbackRepository);

// Initialize feedbackeservice and inject required dependencies
const feedbackeservice = new FeedbackServiceClass(
  createFeedbackUsecase,
  deleteFeedbackUsecase,
  getFeedbackByIdUsecase,
  updateFeedbackUsecase,
  getAllfeedbackesUsecase
);

// Create an Express router
export const feedbackRouter = Router();

// Route handling for creating a new feedback
feedbackRouter.post("/", validateFeedbackInputMiddleware(false), feedbackeservice.createFeedback.bind(feedbackeservice));

// Route handling for getting all feedbackes
feedbackRouter.get("/", feedbackeservice.getAllFeedbacks.bind(feedbackeservice));

// Route handling for getting an feedback by ID
feedbackRouter.get("/:feedbackId", feedbackeservice.getFeedbackById.bind(feedbackeservice));

// Route handling for updating an feedback by ID
feedbackRouter.put("/:feedbackId", validateFeedbackInputMiddleware(true), feedbackeservice.updateFeedback.bind(feedbackeservice));

// Route handling for deleting an feedback by ID
feedbackRouter.delete("/:feedbackId", feedbackeservice.deleteFeedback.bind(feedbackeservice));
