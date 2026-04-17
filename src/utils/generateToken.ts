import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
  }

  const { id, role } = user.safeData;

  return jwt.sign({ id, role }, secret, { expiresIn: "2h" });
};

export default generateToken;