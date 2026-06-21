import { Router, RequestHandler } from "express";
import { ProductController } from "../controllers/productController.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const productRouter: Router = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

productRouter.get("/", asyncHandler(ProductController.list));
productRouter.get("/:id", asyncHandler(ProductController.getById));
productRouter.post(
  "/",
  authMiddleware,
  requireAdmin,
  asyncHandler(ProductController.create),
);
productRouter.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  asyncHandler(ProductController.update),
);
productRouter.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  asyncHandler(ProductController.remove),
);

export default productRouter;
