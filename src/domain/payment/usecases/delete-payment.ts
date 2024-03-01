import {type PaymentRepository } from "@domain/payment/repositories/payment-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface DeletePaymentUsecase {
  execute: (paymentId: string) => Promise<Either<ErrorClass, void>>
}

export class DeletePayment implements DeletePaymentUsecase {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(paymentId: string): Promise<Either<ErrorClass, void>> {
    return await this.paymentRepository.deletePayment(paymentId);
  }
}
