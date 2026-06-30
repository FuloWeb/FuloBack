import { z } from "zod";

export const addItemSchema = z.object({
  productId: z
    .number({
      required_error: "O produto é obrigatório.",
    })
    .int()
    .positive(),

  quantity: z
    .number({
      required_error: "A quantidade é obrigatória.",
    })
    .int()
    .positive(),
});

export const updateItemSchema = z.object({
  productId: z
    .number({
      required_error: "O produto é obrigatório.",
    })
    .int()
    .positive(),

  quantity: z
    .number({
      required_error: "A quantidade é obrigatória.",
    })
    .int()
    .min(1),
});

export const removeItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
});
