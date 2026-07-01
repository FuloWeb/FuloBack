import { Router, RequestHandler } from "express";
import { CartController } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const cartRouter = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

cartRouter.use(authMiddleware);
cartRouter.get("/", asyncHandler(CartController.get));
cartRouter.post("/items", asyncHandler(CartController.addItem));
cartRouter.patch("/items", asyncHandler(CartController.updateItem));
cartRouter.delete("/items/:productId", asyncHandler(CartController.removeItem));
cartRouter.delete("/", asyncHandler(CartController.clear));
cartRouter.post("/checkout", asyncHandler(CartController.checkout));

export default cartRouter;