import { ownerRouter } from "@presentation/routes/owner-routes";
import { busOperatorRouter } from "@presentation/routes/busOperator-routes";
import { busRouter } from "@presentation/routes/bus-routes";
import { travelRouter } from "@presentation/routes/travel-routes";
import { busRouteRouter } from "@presentation/routes/busRoute-routes";
import { busScheduleRouter } from "@presentation/routes/busSchedule-routes";
import { guestRouter } from "@presentation/routes/guest-routes";
import { userRouter } from "@presentation/routes/user-routes";
import { bookingRouter } from "@presentation/routes/booking-routes";
import { paymentRouter } from "@presentation/routes/payment-routes";
import { feedbackRouter } from "@presentation/routes/Feedback-routes";

import { Express, Router, Request, Response, NextFunction } from "express";
import ApiError from "@presentation/error-handling/api-error";

export default (app: Express): void => {
  const router = Router();

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  // Mount user router
  app.use("/owner", ownerRouter);  
  app.use("/busOperator", busOperatorRouter);
  app.use("/bus", busRouter);
  app.use("/travel", travelRouter);
  app.use("/busRoute", busRouteRouter);
  app.use("/busSchedule", busScheduleRouter);
  app.use("/guest", guestRouter);
  app.use("/user", userRouter);
  app.use("/booking", bookingRouter);
  app.use("/payment", paymentRouter);  
  app.use("/feedback", feedbackRouter);

  // 404 error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = ApiError.notFound();
    next(error);
  });

  // Global error handler
  app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });
};
