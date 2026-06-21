import { prisma } from "../database/prisma.js";

type CreateProduct = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  color: string;
  categoryId: number;
};

export type UpdateProductData = Partial<{
  name: string;
  description?: string;
  price: number;
  quantity: number;
  color: string;
  categoryId: number;
}>;

export const ProductModel = {
  async findOutOfStock() {
    return prisma.product.findMany({
      where: {
        quantity: 0,
      },

      include: {
        productCategory: true,
      },
    });
  },

  async findAll() {
    return prisma.product.findMany({
      include: {
        photo: true,
        productCategory: true,
      },
    });
  },

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        photo: true,
        productCategory: true,
      },
    });
  },

  async findByName(name: string) {
    return prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  },

  async create(data: CreateProduct & { file: Express.Multer.File }) {
    return prisma.$transaction(async (tx) => {
      const photo = await tx.photo.create({
        data: {
          blob: new Uint8Array(data.file.buffer),
          filename: data.file.originalname,
          mimetype: data.file.mimetype,
        },
      });

      return tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          color: data.color,
          categoryId: data.categoryId,
          photoId: photo.id,
        },
      });
    });
  },

  // must to be refined next
  async update(id: number, data: UpdateProductData) {
    return prisma.product.update({
      where: {
        id,
      },
      data,
      include: {
        photo: true,
        productCategory: true,
      },
    });
  },

  async delete(id: number) {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      await tx.product.delete({
        where: { id },
      });

      if (product.photoId) {
        await tx.photo.delete({
          where: {
            id: product.photoId,
          },
        });
      }
    });
  },
};
