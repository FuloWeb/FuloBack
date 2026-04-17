import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest.js";
import { logger } from "../config/logger.js";
import { Role } from "../models/user.js";

export const authorizationAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Verificando o tipo de autorização do usuário...");

  if (!req.user || req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }

  next();
};