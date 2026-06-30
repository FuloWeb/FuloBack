import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const emailSchema = z.object({
  email: z.coerce.string().email(),
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(8),
});