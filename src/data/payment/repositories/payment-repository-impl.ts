import { PaymentModel, PaymentEntity } from "@domain/payment/entities/payment";
import { PaymentRepository } from "@domain/payment/repositories/payment-repository"; 
import { PaymentDataSource, PaymentQuery } from "@data/payment/datasource/payment-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class PaymentRepositoryImpl implements PaymentRepository {
  private readonly dataSource: PaymentDataSource;

  constructor(dataSource: PaymentDataSource) {
    this.dataSource = dataSource;
  }

  async createPayment(payment: PaymentModel): Promise<Either<ErrorClass, PaymentEntity>> {
    // return await this.dataSource.create(payment);
    try {
      let i = await this.dataSource.create(payment);
      return Right<ErrorClass, PaymentEntity>(i);
    } catch (e) {
      // if(e instanceof ApiError && e.name === "paymentNumber_conflict"){
      //   return Left<ErrorClass, PaymentEntity>(ApiError.paymentNumberExits());
      // }
      return Left<ErrorClass, PaymentEntity>(ApiError.badRequest());
    }
  }

  async deletePayment(id: string): Promise<Either<ErrorClass, void>> {
    // await this.dataSource.delete(id);
    
    try {
      let i = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(i);
    } catch {
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async updatePayment(id: string, data: PaymentModel): Promise<Either<ErrorClass, PaymentEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, PaymentEntity>(i);
    } catch {
      return Left<ErrorClass, PaymentEntity>(ApiError.badRequest());
    }
  }

  async getpaymentes(query: PaymentQuery): Promise<Either<ErrorClass, PaymentEntity[]>> {
    // return await this.dataSource.getAllpaymentes();
    try {
      let i = await this.dataSource.getAllpaymentes(query);
      return Right<ErrorClass, PaymentEntity[]>(i);
    } catch {
      return Left<ErrorClass, PaymentEntity[]>(ApiError.badRequest());
    }
  }

  async getPaymentById(id: string): Promise<Either<ErrorClass, PaymentEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, PaymentEntity | null>(i);
    } catch {
      return Left<ErrorClass, PaymentEntity | null>(ApiError.badRequest());
    }
  }
}
