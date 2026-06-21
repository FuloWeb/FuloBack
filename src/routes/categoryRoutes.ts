import { Router, RequestHandler } from "express";
import { CategoryController } from "../controllers/categoryController.js";

const categoryRouter: Router = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

categoryRouter.get("/", asyncHandler(CategoryController.list));
categoryRouter.get("/:id", asyncHandler(CategoryController.getById));
categoryRouter.post("/", asyncHandler(CategoryController.create));
categoryRouter.put("/:id", asyncHandler(CategoryController.update));
categoryRouter.delete("/:id", asyncHandler(CategoryController.remove));

export default categoryRouter;