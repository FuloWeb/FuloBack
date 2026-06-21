import { Router, RequestHandler } from "express";
import { ReportController } from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";

const reportRouter = Router();

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

reportRouter.get(
  "/missing-products",
  authMiddleware,
  requireAdmin,
  asyncHandler(ReportController.missingProducts),
);

reportRouter.get(
  "/sales-by-client",
  authMiddleware,
  requireAdmin,
  asyncHandler(ReportController.salesByClient),
);

reportRouter.get(
  "/daily-revenue",
  authMiddleware,
  requireAdmin,
  asyncHandler(ReportController.dailyRevenue),
);

export default reportRouter;
