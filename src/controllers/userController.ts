import { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/user.js";
import { AppError } from "../utils/appError.js";
import { logger } from "../config/logger.js";
import bcrypt from "bcrypt";
import { debug } from "node:console";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(8),
});

export const UserController = {
  async list(req: Request, res: Response) {
    logger.http("GET /users");
    const users = await UserModel.findAll();
    return res.status(200).json({
      data: users,
      meta: { total: users.length },
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    logger.http("GET /users/:id", { id });

    const user = await UserModel.findById(id);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return res.status(200).json({ data: user });
  },

  async create(req: Request, res: Response) {
    const data = userSchema.parse(req.body);

    const existing = await UserModel.findByEmail(data.email);
    if (existing) throw new AppError("E-mail já cadastrado", 409);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({ ...data, password: hashedPassword });

    logger.success("POST /users", { email: data.email });
    return res.status(201).json({ data: user });
  },

  async update(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    const data = userSchema.partial().parse(req.body);
    logger.http("PUT /users/:id", { id });

    const existing = await UserModel.findById(id);
    if (!existing) throw new AppError("Usuário não encontrado", 404);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await UserModel.update(id, data);
    return res.status(200).json({ data: user });
  },

  async remove(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    logger.warn("DELETE /users/:id", { id });

    const existing = await UserModel.findById(id);
    if (!existing) throw new AppError("Usuário não encontrado", 404);

    await UserModel.delete(id);
    return res.status(204).send();
  },
};