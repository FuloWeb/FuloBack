import { Router, RequestHandler } from "express";
import { OrderController } from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";

const orderRouter = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

orderRouter.get("/", requireAdmin, asyncHandler(OrderController.list));
orderRouter.get("/my-orders", asyncHandler(OrderController.myOrders));
orderRouter.get("/:id", asyncHandler(OrderController.getById));
orderRouter.post("/", asyncHandler(OrderController.create));
orderRouter.patch(
  "/:id/status",
  requireAdmin,
  asyncHandler(OrderController.updateStatus),
);

orderRouter.delete("/:id", requireAdmin, asyncHandler(OrderController.remove));

export default orderRouter;