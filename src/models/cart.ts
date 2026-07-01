import { prisma } from "../database/prisma.js";

export const CartModel = {
  async getOrCreateCart(userId: number) {
    let cart = await prisma.order.findFirst({
      where: {
        userId,
        status: "AGUARDANDO_PAGAMENTO",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.order.create({
        data: {
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
    }

    return cart;
  },

  async addItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("[Cart - Product] Produto não encontrado.");
    }

    if (product.quantity < quantity) {
      throw new Error("[Cart - Product] Estoque insuficiente.");
    }

    const existing = await prisma.orderItem.findFirst({
      where: {
        orderId: cart.id,
        productId,
      },
    });

    if (existing) {
      return prisma.orderItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + quantity,
        },
      });
    }

    return prisma.orderItem.create({
      data: {
        orderId: cart.id,
        productId,
        quantity,
      },
    });
  },

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);

    return prisma.orderItem.deleteMany({
      where: {
        orderId: cart.id,
        productId,
      },
    });
  },

  async updateQuantity(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    return prisma.orderItem.updateMany({
      where: {
        orderId: cart.id,
        productId,
      },
      data: {
        quantity,
      },
    });
  },

  // * Limpar carrinho (usuário)
  async clear(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    return prisma.orderItem.deleteMany({
      where: {
        orderId: cart.id,
      },
    });
  },

  async get(userId: number) {
    return this.getOrCreateCart(userId);
  },
};