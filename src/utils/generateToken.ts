import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";

export const generateToken = (user: UserModel): String => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
  }

  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "2h",
  });
};
