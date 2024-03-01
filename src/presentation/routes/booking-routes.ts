// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { bookingeservice as BookingServiceClass } from "@presentation/services/booking-services"; // Rename the import
import { BookingDataSourceImpl } from "@data/booking/datasource/booking-data-source";
import { BookingRepositoryImpl } from "@data/booking/repositories/booking-repository-impl";
import { CreateBooking } from "@domain/booking/usecases/create-booking";
import { DeleteBooking } from "@domain/booking/usecases/delete-booking";
import { GetBookingById } from "@domain/booking/usecases/get-booking-by-id";
import { GetAllbookinges } from "@domain/booking/usecases/get-all-bookings";
import { UpdateBooking } from "@domain/booking/usecases/update-booking";
import { validateBookingInputMiddleware } from "@presentation/middlewares/booking/validation-middleware";

// Create an instance of the BookingDataSourceImpl and pass the mongoose connection
const bookingDataSource = new BookingDataSourceImpl(mongoose.connection);

// Create an instance of the BookingRepositoryImpl and pass the BookingDataSourceImpl
const bookingRepository = new BookingRepositoryImpl(bookingDataSource);

// Create instances of the required use cases and pass the BookingRepositoryImpl
const createBookingUsecase = new CreateBooking(bookingRepository);
const deleteBookingUsecase = new DeleteBooking(bookingRepository);
const getBookingByIdUsecase = new GetBookingById(bookingRepository);
const updateBookingUsecase = new UpdateBooking(bookingRepository);
const getAllbookingesUsecase = new GetAllbookinges(bookingRepository);

// Initialize bookingeservice and inject required dependencies
const bookingeservice = new BookingServiceClass(
  createBookingUsecase,
  deleteBookingUsecase,
  getBookingByIdUsecase,
  updateBookingUsecase,
  getAllbookingesUsecase
);

// Create an Express router
export const bookingRouter = Router();

// Route handling for creating a new booking
bookingRouter.post("/", validateBookingInputMiddleware(false), bookingeservice.createBooking.bind(bookingeservice));

// Route handling for getting all bookinges
bookingRouter.get("/", bookingeservice.getAllbookinges.bind(bookingeservice));

// Route handling for getting an booking by ID
bookingRouter.get("/:bookingId", bookingeservice.getBookingById.bind(bookingeservice));

// Route handling for updating an booking by ID
bookingRouter.put("/:bookingId", validateBookingInputMiddleware(true), bookingeservice.updateBooking.bind(bookingeservice));

// Route handling for deleting an booking by ID
bookingRouter.delete("/:bookingId", bookingeservice.deleteBooking.bind(bookingeservice));
