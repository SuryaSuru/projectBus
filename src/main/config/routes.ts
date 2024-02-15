import { userRouter } from "@presentation/routes/user-routes";
import { Express, Router, Request, Response, NextFunction } from "express";
import ApiError from "@presentation/error-handling/api-error";

export default (app: Express): void => {
  const router = Router();

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  // Mount user router
  app.use("/user", userRouter);

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
