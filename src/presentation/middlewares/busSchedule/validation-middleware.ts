import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the structure of the input for BusSchedule
interface BusScheduleInput {
  routeId: string;
  busId: string;
  departureTime: Date;
  boardingPoints: string[];
  droppingPoints: string[];
  arrivalTime?: Date;
  journeyDate?: Date;
  scheduleStatus: string;
}

// Define a validator function for BusSchedule input
const busScheduleValidator = (
  input: BusScheduleInput,
  isUpdate: boolean = false
) => {
  // Define a schema for BusSchedule input using Joi
  const busScheduleSchema = Joi.object<BusScheduleInput>({
    routeId: isUpdate
      ? Joi.string().optional().trim().messages({
          "string.base": "Route ID should be a string",
        })
      : Joi.string().required().trim().messages({
          "any.required": "Route ID is required",
        }),
    busId: isUpdate
      ? Joi.string().optional().trim().messages({
          "string.base": "Bus ID should be a string",
        })
      : Joi.string().required().trim().messages({
          "any.required": "Bus ID is required",
        }),
    departureTime: isUpdate
      ? Joi.date().optional().messages({
          "date.base": "Departure time should be a valid date",
        })
      : Joi.date().required().messages({
          "any.required": "Departure time is required",
        }),
    boardingPoints: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Boarding points should be an array of strings",
    }),
    droppingPoints: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Dropping points should be an array of strings",
    }),
    arrivalTime: isUpdate
      ? Joi.date().optional().messages({
          "date.base": "Arrival time should be a valid date",
        })
      : Joi.date().optional().messages({
          "date.base": "Arrival time should be a valid date",
        }),
    journeyDate: isUpdate
      ? Joi.date().optional().messages({
          "date.base": "Journey date should be a valid date",
        })
      : Joi.date().optional().messages({
          "date.base": "Journey date should be a valid date",
        }),
    scheduleStatus: isUpdate
      ? Joi.string().valid("Scheduled", "Cancelled").optional().messages({
          "any.only": "Schedule status must be either 'Scheduled' or 'Cancelled'",
        })
      : Joi.string().valid("Scheduled", "Cancelled").required().messages({
          "any.required": "Schedule status is required",
          "any.only": "Schedule status must be either 'Scheduled' or 'Cancelled'",
        }),
  });

  // Validate the input against the schema
  const { error, value } = busScheduleSchema.validate(input, {
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

// Define a middleware for validating BusSchedule input
export const validateBusScheduleInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client's BusSchedule input using the busScheduleValidator
      const validatedInput: BusScheduleInput = busScheduleValidator(
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
