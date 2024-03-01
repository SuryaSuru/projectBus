import { PaymentModel, PaymentEntity } from "@domain/payment/entities/payment";
import { PaymentRepository } from "@domain/payment/repositories/payment-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetPaymentByIdUsecase {
  execute: (paymentId: string) => Promise<Either<ErrorClass, PaymentEntity | null>>;
}

export class GetPaymentById implements GetPaymentByIdUsecase {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(paymentId: string): Promise<Either<ErrorClass, PaymentEntity | null>> {
    return await this.paymentRepository.getPaymentById(paymentId);
  }
}
