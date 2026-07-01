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

// Status que representam pedidos válidos para relatório (excluí CANCELADO)
const VALID_REPORT_STATUSES: OrderStatus[] = [
  OrderStatus.AGUARDANDO_PAGAMENTO,
  OrderStatus.PAGAMENTO_APROVADO,
  OrderStatus.EM_PROCESSAMENTO,
  OrderStatus.ENVIADO,
  OrderStatus.ENTREGUE,
];

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
      where: { userId },
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
      data: { status },
    });
  },

  async delete(id: number) {
    return prisma.order.delete({
      where: { id },
    });
  },

  // para exportacao de pdf
  async salesByClient(startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        // Ignora pedidos cancelados
        status: {
          in: VALID_REPORT_STATUSES,
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totals = new Map<string, number>();

    for (const order of orders) {
      const clientName = order.user.name ?? order.user.email;

      let orderTotal = 0;

      for (const item of order.items) {
        orderTotal += item.quantity * item.product.price;
      }

      totals.set(clientName, (totals.get(clientName) ?? 0) + orderTotal);
    }

    return Array.from(totals.entries())
      .map(([clientName, total]) => ({ clientName, total }))
      .sort((a, b) => b.total - a.total); // ordena por maior total
  },

  async dailyRevenue(startDate: Date, endDate: Date) {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        // Ignora pedidos cancelados
        status: {
          in: VALID_REPORT_STATUSES,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const revenue = new Map<string, number>();

    for (const order of orders) {
      const date = order.createdAt.toISOString().split("T")[0];

      let total = 0;

      for (const item of order.items) {
        total += item.quantity * item.product.price;
      }

      revenue.set(date, (revenue.get(date) ?? 0) + total);
    }

    return Array.from(revenue.entries()).map(([date, total]) => ({
      date,
      total,
    }));
  },
};
