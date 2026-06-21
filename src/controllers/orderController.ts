import { Request, Response } from "express";
import { z } from "zod";

import { OrderModel } from "../models/order.js";
import { AppError } from "../utils/appError.js";
import { AuthRequest } from "../types/authRequest.js";

const idSchema = z.object({
  id: z.coerce.number().positive(),
});

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.coerce.number().positive(),
      quantity: z.coerce.number().positive(),
    }),
  ),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "AGUARDANDO_PAGAMENTO",
    "PAGAMENTO_APROVADO",
    "EM_PROCESSAMENTO",
    "ENVIADO",
    "ENTREGUE",
    "CANCELADO",
  ]),
});

export const OrderController = {
  async list(req: Request, res: Response) {
    const orders = await OrderModel.list();

    return res.json({
      data: orders,
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return res.json({
      data: order,
    });
  },

  async myOrders(req: AuthRequest, res: Response) {
    const orders = await OrderModel.findByUser(req.user!.id);

    return res.json({
      data: orders,
    });
  },

  async create(req: Request, res: Response) {
    const data = createOrderSchema.parse(req.body);

    const userId = req.session.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const order = await OrderModel.create(userId, data);

    return res.status(201).json({
      data: order,
    });
  },

  async remove(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    await OrderModel.delete(id);

    return res.json({
      success: true,
    });
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const { status } = updateStatusSchema.parse(req.body);

    const order = await OrderModel.updateStatus(id, status);

    return res.json({
      data: order,
    });
  },
};
