import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { logger } from "../config/logger.js";
import { AuthRequest } from "../types/authRequest.js";
import { Role } from "../models/user.js";

export const jwtPayloadSchema = z.object({
  id: z.number(),
  role: z.nativeEnum(Role),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("JWT_SECRET não definido nas variáveis de ambiente.");
    return res.status(500).json({ error: "Erro interno do servidor." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const parsed = jwtPayloadSchema.safeParse(decoded);
    if (!parsed.success) {
      logger.warn("Payload do token inválido", parsed.error.flatten());
      return res.status(401).json({ error: "Token inválido." });
    }

    req.user = parsed.data;
    next();
  } catch (err) {
    logger.error("Erro no middleware de autenticação", err);
    return res.status(401).json({ error: "Token inválido." });
  }
};