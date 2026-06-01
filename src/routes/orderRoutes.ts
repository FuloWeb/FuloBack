import { Router, Request, Response, NextFunction } from "express";
// import { OrderController } from "../controllers/orderController.js";

const orderRouter: Router = Router();
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

orderRouter.get("/", asyncHandler(OrderController.list));
orderRouter.get("/:id", asyncHandler(OrderController.getById));
orderRouter.get("/:email", asyncHandler(OrderController.getByEmail));
orderRouter.post("/", asyncHandler(OrderController.create));
orderRouter.put("/:id", asyncHandler(OrderController.update));
orderRouter.delete("/:id", asyncHandler(OrderController.remove));

export default orderRouter;