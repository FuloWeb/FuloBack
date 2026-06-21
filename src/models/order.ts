import { prisma } from "../database/prisma.js";
import { OrderStatus } from "../generated/prisma/index.js";

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
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  },

  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },

      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  },

  async findByUser(userId: number) {
    return prisma.order.findMany({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async updateStatus(id: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id },

      data: {
        status,
      },
    });
  },

  async delete(id: number) {
    return prisma.order.delete({
      where: { id },
    });
  },
};
