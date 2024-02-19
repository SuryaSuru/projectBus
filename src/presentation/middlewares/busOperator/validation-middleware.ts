import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for BusOperator
interface BusOperatorInput {
  operatorName: string;
  contactInfo: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  disabled?: boolean;
}

// Define a validator function for BusOperator input
const busOperatorValidator = (
  input: BusOperatorInput,
  isUpdate: boolean = false
) => {
  // Define a schema for BusOperator input using Joi
  const busOperatorSchema = Joi.object<BusOperatorInput>({
    operatorName: isUpdate
      ? Joi.string().max(100).optional().trim().messages({
        "string.max": "Operator name should have less than 100 characters",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Operator name should have less than 100 characters",
        "any.required": "Operator name is required",
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
      }),
      disabled: Joi.boolean().optional(),
  });

  // Validate the input against the schema
  const { error, value } = busOperatorSchema.validate(input, {
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

// Define a middleware for validating BusOperator input
export const validateBusOperatorInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's BusOperator input using the busOperatorValidator
      const validatedInput: BusOperatorInput = busOperatorValidator(
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
