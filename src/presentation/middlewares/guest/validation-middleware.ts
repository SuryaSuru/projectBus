import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Guest
interface GuestInput {
  guestName: string;
  contactInfo: string;
  address: string;
}

// Define a validator function for Guest input
const guestValidator = (
  input: GuestInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Guest input using Joi
  const guestSchema = Joi.object<GuestInput>({
    guestName: isUpdate
      ? Joi.string().max(100).optional().trim().messages({
        "string.max": "Guest name should have less than 100 characters",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Guest name should have less than 100 characters",
        "any.required": "Guest name is required",
      }),
    contactInfo: isUpdate
      ? Joi.string().max(100).optional().trim().messages({
        "string.max": "Contact info should have less than 100 characters",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Contact info should have less than 100 characters",
        "any.required": "Contact info is required",
      }),
    address: isUpdate
      ? Joi.string().max(255).optional().trim().messages({
        "string.max": "Address should have less than 255 characters",
      })
      : Joi.string().max(255).required().trim().messages({
        "string.max": "Address should have less than 255 characters",
        "any.required": "Address is required",
      })
  });

  // Validate the input against the schema
  const { error, value } = guestSchema.validate(input, {
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

// Define a middleware for validating Guest input
export const validateGuestInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Guest input using the guestValidator
      const validatedInput: GuestInput = guestValidator(
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
