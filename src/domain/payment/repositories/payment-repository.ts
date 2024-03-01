import { PaymentModel, PaymentEntity } from "@domain/payment/entities/payment";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
export interface PaymentRepository {
  createPayment(Payment: PaymentModel): Promise<Either<ErrorClass, PaymentEntity>>;
  deletePayment(id: string): Promise<Either<ErrorClass, void>>;
  updatePayment(id: string, data: PaymentModel): Promise<Either<ErrorClass, PaymentEntity>>;
  getpaymentes(query: object): Promise<Either<ErrorClass, PaymentEntity[]>>;
  getPaymentById(id: string): Promise<Either<ErrorClass, PaymentEntity | null>>;
}

