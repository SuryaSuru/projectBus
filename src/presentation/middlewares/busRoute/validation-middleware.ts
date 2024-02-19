import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { BusRouteModel } from "@domain/busRoute/entities/busRoute"; // Assuming the path to the UserModel type

// Define the structure of the input for BusRoute
interface BusRouteInput {
  sourceLocation: string;
  destinationLocation: string;
  distance: number;
  estimatedDuration?: Date;
  price: number;
  routeStatus: 'Active' | 'Inactive'
  disabled?: boolean;
}

// Define a validator function for BusRoute input
const busRouteValidator = (
  input: BusRouteInput,
  isUpdate: boolean = false
  ) => {
  // Define a schema for BusRoute input using Joi
  const busRouteSchema = Joi.object<BusRouteInput>({
    sourceLocation: isUpdate
    ? Joi.string().optional().trim().messages({
      "any.required": "Source location is required",
    })
    : Joi.string().required().trim().messages({
      "any.required": "Source location is required",
    }),
    destinationLocation: isUpdate
    ? Joi.string().optional().trim().messages({
      "any.required": "Destination location is required",
    })
    : Joi.string().required().trim().messages({
      "any.required": "Destination location is required",
    }),
    distance: isUpdate
    ? Joi.number().optional().positive().messages({
      "number.positive": "Distance must be a positive number",
      "any.required": "Distance is required",
    })
    : Joi.number().required().positive().messages({
      "number.positive": "Distance must be a positive number",
      "any.required": "Distance is required",
    }),
    estimatedDuration: isUpdate
    ? Joi.date().optional().messages({
      "date.base": "Invalid estimated duration format",
    })
    : Joi.date().required().messages({
      "date.base": "Invalid estimated duration format",
    }),
    price: isUpdate
    ? Joi.number().optional().positive().messages({
      "number.positive": "Price must be a positive number",
      "any.required": "Price is required",
    })
    : Joi.number().required().positive().messages({
      "number.positive": "Price must be a positive number",
      "any.required": "Price is required",
    }),
    routeStatus: isUpdate
    ? Joi.string().optional().valid('Active', 'Inactive').messages({
      "any.only": "Route status must be either 'Active' or 'Inactive'",
      "any.required": "Route status is required",
    })
    : Joi.string().required().valid('Active', 'Inactive').messages({
      "any.only": "Route status must be either 'Active' or 'Inactive'",
      "any.required": "Route status is required",
    }),
    disabled: Joi.boolean().optional(),
  });

  // Validate the input against the schema
  const { error, value } = busRouteSchema.validate(input, {
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

// Define a middleware for validating BusRoute input
export const validateBusRouteInputMiddleware = (
  isUpdate: boolean = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;
  
      // Validate the client's BusRoute input using the busRouteValidator
      const validatedInput: BusRouteInput = busRouteValidator(
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
  }
  
};
