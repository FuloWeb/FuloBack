import { prisma } from "../database/prisma.js";

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  address: string;
};

export enum Role {
  CLIENTE = "cliente",
  ADMIN = "admin",
}

export type UpdateUserData = Partial<CreateUserData>;

export const UserModel = {
  async findAll() {
    return prisma.user.findMany();
  },

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
  },

  async update(id: number, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    await prisma.user.delete({
      where: { id },
    });
  },
};
