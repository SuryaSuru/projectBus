// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { paymenteservice as PaymentServiceClass } from "@presentation/services/payment-services"; // Rename the import
import { PaymentDataSourceImpl } from "@data/payment/datasource/payment-data-source";
import { PaymentRepositoryImpl } from "@data/payment/repositories/payment-repository-impl";
import { CreatePayment } from "@domain/payment/usecases/create-payment";
import { DeletePayment } from "@domain/payment/usecases/delete-payment";
import { GetPaymentById } from "@domain/payment/usecases/get-payment-by-id";
import { GetAllpaymentes } from "@domain/payment/usecases/get-all-payments";
import { UpdatePayment } from "@domain/payment/usecases/update-payment";
import { validatePaymentInputMiddleware } from "@presentation/middlewares/payment/validation-middleware";

// Create an instance of the PaymentDataSourceImpl and pass the mongoose connection
const paymentDataSource = new PaymentDataSourceImpl(mongoose.connection);

// Create an instance of the PaymentRepositoryImpl and pass the PaymentDataSourceImpl
const paymentRepository = new PaymentRepositoryImpl(paymentDataSource);

// Create instances of the required use cases and pass the PaymentRepositoryImpl
const createPaymentUsecase = new CreatePayment(paymentRepository);
const deletePaymentUsecase = new DeletePayment(paymentRepository);
const getPaymentByIdUsecase = new GetPaymentById(paymentRepository);
const updatePaymentUsecase = new UpdatePayment(paymentRepository);
const getAllpaymentesUsecase = new GetAllpaymentes(paymentRepository);

// Initialize paymenteservice and inject required dependencies
const paymenteservice = new PaymentServiceClass(
  createPaymentUsecase,
  deletePaymentUsecase,
  getPaymentByIdUsecase,
  updatePaymentUsecase,
  getAllpaymentesUsecase
);

// Create an Express router
export const paymentRouter = Router();

// Route handling for creating a new payment
paymentRouter.post("/", validatePaymentInputMiddleware(false), paymenteservice.createPayment.bind(paymenteservice));

// Route handling for getting all paymentes
paymentRouter.get("/", paymenteservice.getAllPayments.bind(paymenteservice));

// Route handling for getting an payment by ID
paymentRouter.get("/:paymentId", paymenteservice.getPaymentById.bind(paymenteservice));

// Route handling for updating an payment by ID
paymentRouter.put("/:paymentId", validatePaymentInputMiddleware(true), paymenteservice.updatePayment.bind(paymenteservice));

// Route handling for deleting an payment by ID
paymentRouter.delete("/:paymentId", paymenteservice.deletePayment.bind(paymenteservice));
