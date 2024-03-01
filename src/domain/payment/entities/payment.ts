export class PaymentModel {
  constructor(
    public bookingId: string = "",
    public amount: number = 0,
    public paymentStatus: string = "",
    public paymentMethod: string = "",
    public paymentDate: Date = new Date()
  ) {}
}

export class PaymentEntity {
  constructor(
    public id: string | undefined = undefined,
    public bookingId: string,
    public amount: number,
    public paymentStatus: string,
    public paymentMethod: string,
    public paymentDate: Date
  ) {}
}

export class PaymentMapper {
  static toEntity(paymentData: any, includeId: boolean = true, existingPayment?: PaymentEntity): PaymentEntity {
    if (existingPayment != null) {
      return {
        ...existingPayment,
        bookingId: paymentData.bookingId !== undefined ? paymentData.bookingId : existingPayment.bookingId,
        amount: paymentData.amount !== undefined ? paymentData.amount : existingPayment.amount,
        paymentStatus: paymentData.paymentStatus !== undefined ? paymentData.paymentStatus : existingPayment.paymentStatus,
        paymentMethod: paymentData.paymentMethod !== undefined ? paymentData.paymentMethod : existingPayment.paymentMethod,
        paymentDate: paymentData.paymentDate !== undefined ? paymentData.paymentDate : existingPayment.paymentDate
      };
    } else {
      const paymentEntity: PaymentEntity = {
        id: includeId ? (paymentData._id ? paymentData._id.toString() : undefined) : paymentData._id.toString(),
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        paymentStatus: paymentData.paymentStatus,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate
      };
      return paymentEntity;
    }
  }

  static toModel(payment: PaymentEntity): any {
    return {
      id: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      paymentStatus: payment.paymentStatus,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate
    };
  }
}
