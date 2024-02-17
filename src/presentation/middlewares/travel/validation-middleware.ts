import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Travel
interface TravelInput {
  travelName: string;
}

// Define a validator function for Travel input
const travelValidator = (
  input: TravelInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Travel input using Joi
  const travelSchema = Joi.object<TravelInput>({
    travelName: isUpdate
      ? Joi.string().max(100).optional().trim().messages({
        "string.max": "Travel name should have less than 100 characters",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Travel name should have less than 100 characters",
        "any.required": "Travel name is required",
      })
  });

  // Validate the input against the schema
  const { error, value } = travelSchema.validate(input, {
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

// Define a middleware for validating Travel input
export const validateTravelInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Travel input using the travelValidator
      const validatedInput: TravelInput = travelValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};
