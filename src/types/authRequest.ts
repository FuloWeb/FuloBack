import { Request } from "express";
import { z } from "zod";
import { jwtPayloadSchema } from "../middleware/authMiddleware.js";

export type JwtUser = z.infer<typeof jwtPayloadSchema>;

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  address: string;
};

export interface LoginBody {
  email: string;
  password: string;
}