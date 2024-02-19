import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Owner
interface OwnerInput {
  ownerName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  pancardNumber: string;
  photo?: string;
  address?: string;
  isVerified?: boolean;
  disabled?: boolean;
}

// Define a validator function for Owner input
const ownerValidator = (
  input: OwnerInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Owner input using Joi
  const ownerSchema = Joi.object<OwnerInput>({
    ownerName: isUpdate
      ? Joi.string().max(100).optional().trim().messages({
        "string.max": "Owner name should have less than 100 characters",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Owner name should have less than 100 characters",
        "any.required": "Owner name is required",
      }),
    email: isUpdate
      ? Joi.string().email().optional().trim().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Owner name should have less than 100 characters",
        "any.required": "Owner name is required",
      }),
    password: isUpdate
      ? Joi.string().optional().trim().messages({
        "any.required": "Password is required",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Owner name should have less than 100 characters",
        "any.required": "Owner name is required",
      }),
    firstName: Joi.string().max(100).optional().trim().messages({
      "string.max": "First name should have less than 100 characters",
    }),
    lastName: Joi.string().max(100).optional().trim().messages({
      "string.max": "Last name should have less than 100 characters",
    }),
    phone: Joi.string().optional().trim().messages({
      "string.empty": "Phone number must not be empty",
    }),
    pancardNumber: isUpdate
      ? Joi.string().optional().trim().messages({
        "any.required": "Pancard number is required",
      })
      : Joi.string().max(100).required().trim().messages({
        "string.max": "Owner name should have less than 100 characters",
        "any.required": "Owner name is required",
      }),
    photo: Joi.string().optional().trim().messages({
      "string.empty": "Photo must not be empty",
    }),
    address: Joi.string().optional().trim().messages({
      "string.empty": "Address must not be empty",
    }),
    isVerified: Joi.boolean().optional(),
    disabled: Joi.boolean().optional(),
  });

  // Validate the input against the schema
  const { error, value } = ownerSchema.validate(input, {
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

// Define a middleware for validating Owner input
export const validateOwnerInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Owner input using the ownerValidator
      const validatedInput: OwnerInput = ownerValidator(
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
