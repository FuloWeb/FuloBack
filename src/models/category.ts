import { prisma } from "../database/prisma.js";

export type CreateCategory = {
  name: string;
};

export type UpdateProductCategory = Partial<CreateCategory>;

export const CategoryModel = {
  async findAll() {
    return prisma.productCategory.findMany();
  },

  async findById(id: number) {
    return prisma.productCategory.findUnique({
      where: { id },
    });
  },

  async findByName(name: string) {
    return prisma.productCategory.findUnique({
      where: { name },
    });
  },

  async searchByName(name: string) {
    return prisma.productCategory.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  },

  async create(data: CreateCategory) {
    return prisma.productCategory.create({
      data,
    });
  },

  async update(id: number, data: UpdateProductCategory) {
    return prisma.productCategory.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    await prisma.productCategory.delete({
      where: { id },
    });
  },
};
