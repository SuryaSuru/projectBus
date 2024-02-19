import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "@domain/user/entities/user"; // Assuming the path to the UserModel type

// Define the structure of the input for User
interface UserInput {
  userName: string;
  email: string;
  // info: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  disabled?: boolean;
}

// Define a validator function for User input
const userValidator = (
  input: UserInput,
  isUpdate: boolean = false
) => {
  // Define a schema for User input using Joi
  const userSchema = Joi.object<UserModel>({
    userName: isUpdate
      ? Joi.string().max(50).optional().trim().messages({
        "string.max": "Username should have less than 50 characters",
      })
      : Joi.string().max(50).required().trim().messages({
        "string.max": "Username should have less than 50 characters",
        "any.required": "Username is required",
      }),
    email: isUpdate
      ? Joi.string().email().max(100).optional().trim().messages({
        "string.email": "Invalid email format",
        "string.max": "Email should have less than 100 characters",
      })
      : Joi.string().email().max(100).required().trim().messages({
        "string.email": "Invalid email format",
        "string.max": "Email should have less than 100 characters",
        "any.required": "Email is required",
      }),
      info: isUpdate
        ? Joi.string().max(32).optional().trim().messages({
          "string.email": "Invalid email format",
          "string.max": "Email should have less than 100 characters",
        })
        : Joi.string().max(32).required().trim().messages({
          "string.email": "Invalid email format",
          "string.max": "Email should have less than 100 characters",
          "any.required": "Email is required",
        }),
    password: isUpdate
      ? Joi.string().max(100).optional().messages({
        "string.max": "Password should have less than 100 characters",
      })
      : Joi.string().max(100).required().messages({
        "string.max": "Password should have less than 100 characters",
        "any.required": "Password is required",
      }),
    firstName: Joi.string().max(50).optional().allow('').messages({
      "string.max": "First name should have less than 50 characters",
    }),
    lastName: Joi.string().max(50).optional().allow('').messages({
      "string.max": "Last name should have less than 50 characters",
    }),
    phone: Joi.string().max(20).optional().allow('').messages({
      "string.max": "Phone should have less than 20 characters",
    }),
    address: Joi.string().max(255).optional().allow('').messages({
      "string.max": "Address should have less than 255 characters",
    }),
    disabled: Joi.boolean().optional().default(false),
    isVerified: Joi.boolean().optional().default(false)
  });

  // Validate the input against the schema
  const { error, value } = userSchema.validate(input, {
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

// Define a middleware for validating User input
export const validateUserInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's User input using the userValidator
      const validatedInput: UserInput = userValidator(
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
