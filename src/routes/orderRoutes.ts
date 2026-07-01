import { Router, RequestHandler } from "express";
import { OrderController } from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";

const orderRouter = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Admin
orderRouter.get("/", requireAdmin, asyncHandler(OrderController.list));
orderRouter.patch("/:id/status", requireAdmin, asyncHandler(OrderController.updateStatus));
orderRouter.delete("/:id", requireAdmin, asyncHandler(OrderController.remove));

// Autenticado
orderRouter.get("/my-orders", authMiddleware, asyncHandler(OrderController.myOrders));
orderRouter.post("/", authMiddleware, asyncHandler(OrderController.create));

// Público (mas sessão é verificada no controller)
orderRouter.get("/:id", asyncHandler(OrderController.getById));

export default orderRouter;
