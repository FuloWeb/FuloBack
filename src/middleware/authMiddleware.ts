import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.session.user) {
      logger.warn("Tentativa de acesso sem autenticação", {
        path: req.originalUrl,
        method: req.method,
      });

      return res.status(401).json({
        error: "Não autenticado.",
      });
    }

    next();
  } catch (error) {
    logger.error("POST /auth/login - Erro no middleware de autenticação", error);

    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
};