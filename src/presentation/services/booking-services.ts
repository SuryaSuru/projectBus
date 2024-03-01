import { NextFunction, Request, Response } from "express";
import {
  BookingModel,
  BookingEntity,
  BookingMapper,
} from "@domain/booking/entities/booking";
import { CreateBookingUsecase } from "@domain/booking/usecases/create-booking";
import { DeleteBookingUsecase } from "@domain/booking/usecases/delete-booking";
import { GetBookingByIdUsecase } from "@domain/booking/usecases/get-booking-by-id";
import { UpdateBookingUsecase } from "@domain/booking/usecases/update-booking";
import { GetAllbookingesUsecase } from "@domain/booking/usecases/get-all-bookings";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class bookingeservice {
  private readonly createBookingUsecase: CreateBookingUsecase;
  private readonly deleteBookingUsecase: DeleteBookingUsecase;
  private readonly getBookingByIdUsecase: GetBookingByIdUsecase;
  private readonly updateBookingUsecase: UpdateBookingUsecase;
  private readonly getAllbookingesUsecase: GetAllbookingesUsecase;

  constructor(
    createBookingUsecase: CreateBookingUsecase,
    deleteBookingUsecase: DeleteBookingUsecase,
    getBookingByIdUsecase: GetBookingByIdUsecase,
    updateBookingUsecase: UpdateBookingUsecase,
    getAllbookingesUsecase: GetAllbookingesUsecase
  ) {
    this.createBookingUsecase = createBookingUsecase;
    this.deleteBookingUsecase = deleteBookingUsecase;
    this.getBookingByIdUsecase = getBookingByIdUsecase;
    this.updateBookingUsecase = updateBookingUsecase;
    this.getAllbookingesUsecase = getAllbookingesUsecase;
  }

  async createBooking(req: Request, res: Response): Promise<void> {
      
      // Extract booking data from the request body and convert it to BookingModel
      const bookingData: BookingModel = BookingMapper.toModel(req.body);
      console.log("bookingData--->", bookingData);
      

      // Call the createBookingUsecase to create the booking
      const newBooking: Either<ErrorClass, BookingEntity> = await this.createBookingUsecase.execute(
        bookingData
      );
      console.log("newBooking--->", newBooking);

      newBooking.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BookingEntity) =>{
          const responseData = BookingMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    const bookingId: string = req.params.bookingId;

    // Call the DeleteBookingUsecase to delete the booking
    const updatedBookingEntity: BookingEntity = BookingMapper.toEntity(
      { status: "Cancelled" },
      true
    );

    // Call the UpdateBookingUsecase to update the booking
    const updatedBooking: Either<ErrorClass, BookingEntity> = await this.updateBookingUsecase.execute(
      bookingId,
      updatedBookingEntity
    );

    updatedBooking.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Booking booking deleted successfully' });
        }
    );
}

  async getBookingById(req: Request, res: Response): Promise<void> {
    const bookingId: string = req.params.bookingId;
    console.log("bookingId--->", bookingId);
    

    // Call the GetBookingByIdUsecase to get the Booking by ID
    const booking: Either<ErrorClass, BookingEntity | null> = await this.getBookingByIdUsecase.execute(
      bookingId
    );
    
    console.log("booking--->", booking);

    booking.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: BookingEntity | null) =>{
        const responseData = BookingMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updateBooking(req: Request, res: Response): Promise<void> {
    
      const bookingId: string = req.params.bookingId;
      const bookingData: BookingModel = req.body;

      // Get the existing booking by ID
      const existingBooking: Either<ErrorClass, BookingEntity | null> =
        await this.getBookingByIdUsecase.execute(bookingId);

      if (!existingBooking) {
        // If booking is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert bookingData from BookingModel to BookingEntity using BookingMapper
      const updatedBookingEntity: BookingEntity = BookingMapper.toEntity(
        bookingData,
        true,
      );

      // Call the UpdateBookingUsecase to update the booking
      const updatedBooking: Either<ErrorClass, BookingEntity> = await this.updateBookingUsecase.execute(
        bookingId,
        updatedBookingEntity
      );

      updatedBooking.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: BookingEntity) =>{
          const responseData = BookingMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

async getAllbookinges(req: Request, res: Response, next:NextFunction): Promise<void> {
  const query: any = {};
  query.search = req.query.search as string;

  // Call the GetAllbookingesUsecase to get all bookinges
  const bookinges: Either<ErrorClass, BookingEntity[]> = await this.getAllbookingesUsecase.execute(query);
  

  bookinges.cata(
    (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
    (result: BookingEntity[]) => {
      // Filter out tables with del_status set to "Deleted"
      const nonDeletedBooking = result.filter((booking) => booking.status !== "Cancelled");

      // Convert tables from an array of TableEntity to an array of plain JSON objects using TableMapper
      const responseData = nonDeletedBooking.map((Booking) => BookingMapper.toEntity(Booking));
      return res.json(responseData);
    }
  )
}

}
