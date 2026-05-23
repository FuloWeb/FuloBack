import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest.js";
import { logger } from "../config/logger.js";
import { Role } from "../generated/prisma/index.js";

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Verificando o tipo de autorização do usuário...");
  if (req.user?.role !== Role.ADMIN) {
    return res.status(403).json({
      error: "Acesso negado",
    });
  }

  next();
};
