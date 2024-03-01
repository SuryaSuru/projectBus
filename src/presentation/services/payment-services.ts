import { NextFunction, Request, Response } from "express";
import {
  PaymentModel,
  PaymentEntity,
  PaymentMapper,
} from "@domain/payment/entities/payment";
import { CreatePaymentUsecase } from "@domain/payment/usecases/create-payment";
import { DeletePaymentUsecase } from "@domain/payment/usecases/delete-payment";
import { GetPaymentByIdUsecase } from "@domain/payment/usecases/get-payment-by-id";
import { UpdatePaymentUsecase } from "@domain/payment/usecases/update-payment";
import { GetAllpaymentesUsecase } from "@domain/payment/usecases/get-all-payments";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class paymenteservice {
  private readonly createPaymentUsecase: CreatePaymentUsecase;
  private readonly deletePaymentUsecase: DeletePaymentUsecase;
  private readonly getPaymentByIdUsecase: GetPaymentByIdUsecase;
  private readonly updatePaymentUsecase: UpdatePaymentUsecase;
  private readonly getAllpaymentesUsecase: GetAllpaymentesUsecase;

  constructor(
    createPaymentUsecase: CreatePaymentUsecase,
    deletePaymentUsecase: DeletePaymentUsecase,
    getPaymentByIdUsecase: GetPaymentByIdUsecase,
    updatePaymentUsecase: UpdatePaymentUsecase,
    getAllpaymentesUsecase: GetAllpaymentesUsecase
  ) {
    this.createPaymentUsecase = createPaymentUsecase;
    this.deletePaymentUsecase = deletePaymentUsecase;
    this.getPaymentByIdUsecase = getPaymentByIdUsecase;
    this.updatePaymentUsecase = updatePaymentUsecase;
    this.getAllpaymentesUsecase = getAllpaymentesUsecase;
  }

  async createPayment(req: Request, res: Response): Promise<void> {
      
      // Extract payment data from the request body and convert it to PaymentModel
      const paymentData: PaymentModel = PaymentMapper.toModel(req.body);
      console.log("paymentData--->", paymentData);
      

      // Call the createPaymentUsecase to create the payment
      const newPayment: Either<ErrorClass, PaymentEntity> = await this.createPaymentUsecase.execute(
        paymentData
      );
      console.log("newPayment--->", newPayment);

      newPayment.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: PaymentEntity) =>{
          const responseData = PaymentMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    const paymentId: string = req.params.paymentId;

    // Call the DeletePaymentUsecase to delete the payment
    const deletedPayment: Either<ErrorClass, void> = await this.deletePaymentUsecase.execute(paymentId);

    deletedPayment.cata(
        (error: ErrorClass) => {
            // Respond with error status and message
            res.status(error.status).json({ error: error.message });
        },
        () => {
            // Respond with a 204 No Content status upon successful deletion
            res.status(204).json({ message: 'Payment deleted successfully' });
        }
    );
}


  async getPaymentById(req: Request, res: Response): Promise<void> {
    const paymentId: string = req.params.paymentId;
    console.log("paymentId--->", paymentId);
    

    // Call the GetPaymentByIdUsecase to get the Payment by ID
    const payment: Either<ErrorClass, PaymentEntity | null> = await this.getPaymentByIdUsecase.execute(
      paymentId
    );
    
    console.log("payment--->", payment);

    payment.cata(
      (error: ErrorClass) =>
      res.status(error.status).json({ error: error.message }),
      (result: PaymentEntity | null) =>{
        const responseData = PaymentMapper.toEntity(result, true);
        return res.json(responseData)
      }
    )
      
}

  async updatePayment(req: Request, res: Response): Promise<void> {
    
      const paymentId: string = req.params.paymentId;
      const paymentData: PaymentModel = req.body;

      // Get the existing payment by ID
      const existingPayment: Either<ErrorClass, PaymentEntity | null> =
        await this.getPaymentByIdUsecase.execute(paymentId);

      if (!existingPayment) {
        // If payment is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }
      

      // Convert paymentData from PaymentModel to PaymentEntity using PaymentMapper
      const updatedPaymentEntity: PaymentEntity = PaymentMapper.toEntity(
        paymentData,
        true,
      );

      // Call the UpdatePaymentUsecase to update the payment
      const updatedPayment: Either<ErrorClass, PaymentEntity> = await this.updatePaymentUsecase.execute(
        paymentId,
        updatedPaymentEntity
      );

      updatedPayment.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: PaymentEntity) =>{
          const responseData = PaymentMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }

  async getAllPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query: any = {};
    query.search = req.query.search as string;
  
    // Call the GetAllPaymentsUsecase to get all payments
    const payments: Either<ErrorClass, PaymentEntity[]> = await this.getAllpaymentesUsecase.execute(query);
  
    payments.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: PaymentEntity[]) => {
        return res.json(result);
      }
    );
  }
  
  

}
