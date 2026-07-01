import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.coerce.number().positive(),
      quantity: z.coerce.number().positive(),
    }),
  ),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "AGUARDANDO_PAGAMENTO",
    "PAGAMENTO_APROVADO",
    "EM_PROCESSAMENTO",
    "ENVIADO",
    "ENTREGUE",
    "CANCELADO",
  ]),
});