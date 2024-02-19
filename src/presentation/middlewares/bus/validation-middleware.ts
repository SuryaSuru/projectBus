import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for Bus
interface BusInput {
  operatorId?: string;
  ownerId?: string;
  busNumber?: string;
  type?: string;
  capacity?: number;
  features?: string[];
  description?: string;
  seatsAvailable?: number;
  bookedSeats?: string[];
  soldSeats?: string[];
  image?: string;
  fare?: number;
  registrationDate?: Date;
  busestatus?: string;
  disabled?: boolean;
}

// Define a validator function for Bus input
const busValidator = (
  input: BusInput,
  isUpdate: boolean = false
) => {
  // Define a schema for Bus input using Joi
  const busSchema = Joi.object<BusInput>({
    operatorId: isUpdate 
    ? Joi.string().optional().trim() 
    : Joi.string().required().trim(),
    ownerId: isUpdate 
    ? Joi.string().optional().trim() 
    : Joi.string().required().trim(),
    busNumber: isUpdate 
    ? Joi.string().max(20).optional().trim() 
    : Joi.string().max(20).required().trim(),
    type: isUpdate 
    ? Joi.string().valid('AC', 'Delux', 'Normal', 'Suspense AC', 'Suspense Delux').optional().trim() 
    : Joi.string().valid('AC', 'Delux', 'Normal', 'Suspense AC', 'Suspense Delux').required().trim(),
    capacity: isUpdate 
    ? Joi.number().optional() 
    : Joi.number().required(),
    features: Joi.array().items(Joi.string()).optional(),
    description: isUpdate 
    ? Joi.string().max(200).optional().trim() 
    : Joi.string().max(200).required().trim(),
    seatsAvailable: isUpdate 
    ? Joi.number().optional() 
    : Joi.number().required(),
    bookedSeats: Joi.array().items(Joi.string()).optional(),
    soldSeats: Joi.array().items(Joi.string()).optional(),
    image: Joi.string().max(50).optional().trim(),
    fare: isUpdate ? Joi.number().optional() : Joi.number().required(),
    registrationDate: Joi.date().optional(),
    busestatus: isUpdate 
    ? Joi.string().valid('Active', 'Inactive').optional().trim() 
    : Joi.string().valid('Active', 'Inactive').required().trim(),
    disabled: Joi.boolean().optional()
  });

  // Validate the input against the schema
  const { error, value } = busSchema.validate(input, {
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

// Define a middleware for validating Bus input
export const validateBusInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's Bus input using the busValidator
      const validatedInput: BusInput = busValidator(
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
