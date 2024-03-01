export class BookingModel {
  constructor(
    public userId: string = "",
    public scheduleId: string = "",
    public seatNumber: string[] = [],
    public bookingDate: Date = new Date(),
    public totalAmount: number = 0,
    public status: string = ""
  ) {}
}

export class BookingEntity {
  constructor(
    public id: string | undefined = undefined,
    public userId: string,
    public scheduleId: string,
    public seatNumber: string[],
    public bookingDate: Date,
    public totalAmount: number,
    public status: string
  ) {}
}

export class BookingMapper {
  static toEntity(bookingData: any, includeId: boolean = true, existingBooking?: BookingEntity): BookingEntity {
    if (existingBooking != null) {
      return {
        ...existingBooking,
        userId: bookingData.userId !== undefined ? bookingData.userId : existingBooking.userId,
        scheduleId: bookingData.scheduleId !== undefined ? bookingData.scheduleId : existingBooking.scheduleId,
        seatNumber: bookingData.seatNumber !== undefined ? bookingData.seatNumber : existingBooking.seatNumber,
        bookingDate: bookingData.bookingDate !== undefined ? bookingData.bookingDate : existingBooking.bookingDate,
        totalAmount: bookingData.totalAmount !== undefined ? bookingData.totalAmount : existingBooking.totalAmount,
        status: bookingData.status !== undefined ? bookingData.status : existingBooking.status
      };
    } else {
      const bookingEntity: BookingEntity = {
        id: includeId ? (bookingData._id ? bookingData._id.toString() : undefined) : bookingData._id.toString(),
        userId: bookingData.userId,
        scheduleId: bookingData.scheduleId,
        seatNumber: bookingData.seatNumber,
        bookingDate: bookingData.bookingDate,
        totalAmount: bookingData.totalAmount,
        status: bookingData.status
      };
      return bookingEntity;
    }
  }

  static toModel(booking: BookingEntity): any {
    return {
      id: booking.id,
      userId: booking.userId,
      scheduleId: booking.scheduleId,
      seatNumber: booking.seatNumber,
      bookingDate: booking.bookingDate,
      totalAmount: booking.totalAmount,
      status: booking.status
    };
  }
}
