import { Request } from "express";
import { Role } from "../generated/prisma/index.js";

export interface SessionUser {
  id: number;
  email: string;
  role: Role;
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
