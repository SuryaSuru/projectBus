import express, { type Express } from "express";
import setupRoutes from "@main/config/routes";

export default (): Express => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupRoutes(app);
  return app;
};
