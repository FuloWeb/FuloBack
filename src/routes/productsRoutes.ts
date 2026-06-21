import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/productController.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";

const productRouter: Router = Router();
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

productRouter.get("/", asyncHandler(ProductController.list));
productRouter.get("/:id", asyncHandler(ProductController.getById));
productRouter.post("/", requireAdmin, asyncHandler(ProductController.create));
productRouter.put("/:id", requireAdmin, asyncHandler(ProductController.update));
productRouter.delete("/:id", requireAdmin, asyncHandler(ProductController.remove));

export default productRouter;
