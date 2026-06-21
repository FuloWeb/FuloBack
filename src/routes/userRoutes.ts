import { Router, RequestHandler } from "express";
import { UserController } from "../controllers/userController.js";
import { requireAdmin } from "../middleware/authorizationAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter: Router = Router();
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

userRouter.get("/", authMiddleware, requireAdmin, asyncHandler(UserController.list));
userRouter.get("/:id", asyncHandler(UserController.getById));
userRouter.get("/:email", asyncHandler(UserController.getByEmail));
userRouter.post("/", asyncHandler(UserController.create));
userRouter.put("/:id", authMiddleware, asyncHandler(UserController.update));
userRouter.delete("/:id", authMiddleware, asyncHandler(UserController.remove));

export default userRouter;