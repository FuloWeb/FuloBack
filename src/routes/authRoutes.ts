import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import * as auth from "../service/authService.js";

const authRouter = Router();

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

authRouter.post("/register", asyncHandler(auth.registrarUsuario));
authRouter.post("/login", asyncHandler(auth.autenticarUsuario));

export default authRouter;
