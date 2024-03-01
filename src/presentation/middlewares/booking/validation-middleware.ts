import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Booking
interface BookingInput {
  userId?: string;
  scheduleId?: string;
  seatNumber: string[];
  bookingDate?: Date;
  totalAmount?: number;
  status?: string;
}

// Define a validator function for Booking input
const bookingValidator = (
  input: BookingInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Booking input using Joi
  const bookingSchema = Joi.object<BookingInput>({
    userId: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    scheduleId: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
      seatNumber: Joi.array().items(Joi.string()).optional().messages({
        "array.base": "Boarding points should be an array of strings",
      }),
    bookingDate: Joi.date().optional(),
    totalAmount: isUpdate ? Joi.number().optional() : Joi.number().required(),
    status: isUpdate
      ? Joi.string().valid("Confirmed", "Cancelled").optional().trim()
      : Joi.string().valid("Confirmed", "Cancelled").required().trim(),
  });

  // Validate the input against the schema
  const { error, value } = bookingSchema.validate(input, {
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

// Define a middleware for validating Booking input
export const validateBookingInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Booking input using the bookingValidator
      const validatedInput: BookingInput = bookingValidator(
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
