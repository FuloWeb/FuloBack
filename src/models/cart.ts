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
        data: { userId },
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
      where: { id: productId },
    });

    if (!product) {
      throw new Error("[Cart - Product] Produto não encontrado.");
    }

    const existing = await prisma.orderItem.findFirst({
      where: { orderId: cart.id, productId },
    });

    const totalQuantity = (existing?.quantity ?? 0) + quantity;

    // Checa estoque considerando o que já está no carrinho
    if (product.quantity < totalQuantity) {
      throw new Error(
        `[Cart - Product] Estoque insuficiente. Disponível: ${product.quantity}, no carrinho: ${existing?.quantity ?? 0}.`
      );
    }

    if (existing) {
      return prisma.orderItem.update({
        where: { id: existing.id },
        data: { quantity: totalQuantity },
      });
    }

    return prisma.orderItem.create({
      data: { orderId: cart.id, productId, quantity },
    });
  },

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);

    return prisma.orderItem.deleteMany({
      where: { orderId: cart.id, productId },
    });
  },

  async updateQuantity(userId: number, productId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    // Valida estoque antes de atualizar
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("[Cart - Product] Produto não encontrado.");
    }

    if (product.quantity < quantity) {
      throw new Error(
        `[Cart - Product] Estoque insuficiente. Disponível: ${product.quantity}.`
      );
    }

    return prisma.orderItem.updateMany({
      where: { orderId: cart.id, productId },
      data: { quantity },
    });
  },

  async clear(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    return prisma.orderItem.deleteMany({
      where: { orderId: cart.id },
    });
  },

  async get(userId: number) {
    return this.getOrCreateCart(userId);
  },

  async checkout(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new Error("[Cart - Checkout] Carrinho vazio.");
    }

    // Revalida estoque de todos os itens antes de fechar o pedido
    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        throw new Error(
          `[Cart - Checkout] Estoque insuficiente para "${item.product.name}". Disponível: ${item.product.quantity}.`
        );
      }
    }

    return prisma.$transaction(async (tx) => {
      // Debita o estoque
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: cart.id },
        data: { status: "PAGAMENTO_APROVADO" },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    });
  },
};
