import { prisma } from "../database/prisma.js";

export type CreateOrderItem = {
  productId: number;
  quantity: number;
};

export type CreateOrder = {
  items: CreateOrderItem[];
};

export type UpdateOrder = Partial<CreateOrder>;

export const OrderModel = {
  async create(userId: number, data: CreateOrder) {
    return await prisma.order.create({
      data: {
        userId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  },

  async list() {
    return await prisma.order.findMany();
  },
};
