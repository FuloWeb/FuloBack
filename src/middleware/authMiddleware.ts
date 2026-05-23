import { Response, NextFunction } from "express";

import { logger } from "../config/logger.js";
import { AuthRequest } from "../types/authRequest.js";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.session.user) {
      logger.warn("POST /auth/login - Tentativa de acesso sem autenticação", {
        path: req.originalUrl,
        method: req.method,
      });

      return res.status(401).json({
        error: "Não autenticado.",
      });
    }

    req.user = req.session.user;

    next();
  } catch (error) {
    logger.error("POST /auth/login - Erro no middleware de autenticação", error);

    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
};
