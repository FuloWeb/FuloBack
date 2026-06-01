import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController.js";

const userRouter: Router = Router();
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

userRouter.get("/", asyncHandler(UserController.list));
userRouter.get("/:id", asyncHandler(UserController.getById));
userRouter.get("/:email", asyncHandler(UserController.getByEmail));
userRouter.post("/", asyncHandler(UserController.create));
userRouter.put("/:id", asyncHandler(UserController.update));
userRouter.delete("/:id", asyncHandler(UserController.remove));

export default userRouter;