import { PaymentModel, PaymentEntity } from "@domain/payment/entities/payment";
import { PaymentRepository } from "@domain/payment/repositories/payment-repository"; 
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface UpdatePaymentUsecase {
  execute: (
    paymentId: string,
    paymentData: PaymentModel
  ) => Promise<Either<ErrorClass, PaymentEntity>>;
}

export class UpdatePayment implements UpdatePaymentUsecase {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  async execute(paymentId: string, paymentData: PaymentModel): Promise<Either<ErrorClass, PaymentEntity>> {
   return await this.paymentRepository.updatePayment(paymentId, paymentData);
 }
}
