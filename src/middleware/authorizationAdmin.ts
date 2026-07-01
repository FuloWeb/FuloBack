import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import { Role } from "../generated/prisma/index.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Verificando o tipo de autorização do usuário...");
  if (req.session.user?.role !== Role.ADMIN) {
    return res.status(403).json({
      error: "Acesso negado",
    });
  }

  next();
};
