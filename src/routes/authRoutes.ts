import { Router, RequestHandler } from "express";
import * as auth from "../service/authService.js";

const authRouter = Router();

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

authRouter.post("/register", asyncHandler(auth.registrarUsuario));
authRouter.post("/login", asyncHandler(auth.autenticarUsuario));
authRouter.post("/logout", asyncHandler(auth.encerrarSessao));

export default authRouter;
