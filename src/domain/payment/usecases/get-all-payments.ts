import { PaymentModel, PaymentEntity } from "@domain/payment/entities/payment";
import { PaymentRepository } from "@domain/payment/repositories/payment-repository"; 
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllpaymentesUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, PaymentEntity[]>>;
}

export class GetAllpaymentes implements GetAllpaymentesUsecase {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(query: object): Promise<Either<ErrorClass, PaymentEntity[]>> {
    return await this.paymentRepository.getpaymentes(query);
  }
}
