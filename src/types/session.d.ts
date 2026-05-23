import "express-session";
import { Role } from "../generated/prisma/index.js";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      role: Role;
    };
  }
}
