import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().nonnegative(),
  color: z.string().min(1),
  categoryId: z.coerce.number().positive(),
});

export const updateProductSchema = createProductSchema.partial();