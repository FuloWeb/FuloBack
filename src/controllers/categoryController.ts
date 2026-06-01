import { Request, Response } from "express";
import { z } from "zod";
import { CategoryModel } from "../models/category.js";
import { AppError } from "../utils/appError.js";
import { logger } from "../config/logger.js";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Definido sendo 2 o mínimo, pra algo como TI por exemplo, caso nao coloque o nome todo
const categoryNameSchema = z.object({
  name: z.coerce.string().min(2),
});

export const CategoryController = {
  async list(req: Request, res: Response) {
    const { name } = req.query;

    if (name) {
      const categories = await CategoryModel.searchByName(String(name));
      return res.json({ data: categories });
    }

    const categories = await CategoryModel.findAll();
    return res.json({ data: categories });
  },

  async getById(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    logger.http("GET /category/:id", { id });

    const category = await CategoryModel.findById(id);
    if (!category) throw new AppError("Categoria não encontrada", 404);

    return res.status(200).json({ data: category });
  },

  async create(req: Request, res: Response) {
    const data = categoryNameSchema.parse(req.body);

    const existing = await CategoryModel.findByName(data.name);
    if (existing) throw new AppError("Categoria já cadastrada", 409);

    const category = await CategoryModel.create(data);

    logger.success("POST /category", { name: data.name });
    return res.status(201).json({ data: category });
  },

  async update(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    const data = categoryNameSchema.partial().parse(req.body);
    logger.http("PUT /category/:id", { id });

    const existing = await CategoryModel.findById(id);
    if (!existing) throw new AppError("Categoria não encontrada", 404);

    const category = await CategoryModel.update(id, data);
    return res.status(200).json({ data: category });
  },

  async remove(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);
    logger.warn("DELETE /category/:id", { id });

    const existing = await CategoryModel.findById(id);
    if (!existing) throw new AppError("Categoria não encontrada", 404);

    await CategoryModel.delete(id);
    return res.status(200).json({
      success: true,
      message: "Categoria removida com sucesso",
    });
  },
};
