import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/index.js";

// Geração de token pra uso de JWT TOKEN - atual não usado
export const generateToken = (user: User): String => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
  }

  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "2h",
  });
};
