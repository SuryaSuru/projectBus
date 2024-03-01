import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Feedback
interface FeedbackInput {
  userId?: string;
  busId?: string;
  rating: number;
  comment?: string;
  feedbackDate?: Date;
}

// Define a validator function for Feedback input
const feedbackValidator = (
  input: FeedbackInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Feedback input using Joi
  const feedbackSchema = Joi.object<FeedbackInput>({
    userId: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    busId: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    rating: isUpdate
    ? Joi.number().optional()
    : Joi.number().required(),
    comment: Joi.string().optional().allow("").trim(),
    feedbackDate: Joi.date().optional(),
  });

  // Validate the input against the schema
  const { error, value } = feedbackSchema.validate(input, {
    abortEarly: false,
  });

  // If validation fails, throw a custom ApiError
  if (error) {
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );
    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "),
      "ValidationError"
    );
  }

  return value; // Return the validated input
};

// Define a middleware for validating Feedback input
export const validateFeedbackInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Feedback input using the feedbackValidator
      const validatedInput: FeedbackInput = feedbackValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};
