import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Payment
interface PaymentInput {
  bookingId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate?: Date;
}

// Define a validator function for Payment input
const paymentValidator = (
  input: PaymentInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Payment input using Joi
  const paymentSchema = Joi.object<PaymentInput>({
    bookingId: Joi.string().optional().trim(),
    amount: isUpdate ? Joi.number().optional() : Joi.number().required(),
    paymentStatus: Joi.string().valid("Pending", "Completed", "Failed").optional().trim(),
    paymentMethod: Joi.string().valid("CreditCard", "DebitCard", "NetBanking", "UPI").optional().trim(),
    paymentDate: Joi.date().optional(),
  });

  // Validate the input against the schema
  const { error, value } = paymentSchema.validate(input, {
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

// Define a middleware for validating Payment input
export const validatePaymentInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Payment input using the paymentValidator
      const validatedInput: PaymentInput = paymentValidator(body);

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

};
