import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const createPrismaClient = () => {
  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    throw new Error("DB_URL não definida nas variáveis de ambiente.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

export const prisma = createPrismaClient();