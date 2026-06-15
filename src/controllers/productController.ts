import { Request, Response } from "express";
import { z } from "zod";

import { ProductModel } from "../models/products.js";
import { AppError } from "../utils/appError.js";
import { logger } from "../config/logger.js";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().nonnegative(),
  color: z.string().min(1),
  categoryId: z.coerce.number().positive(),
});

const updateProductSchema = createProductSchema.partial();

export const ProductController = {
  async list(req: Request, res: Response) {
    const { name } = req.query;

    const products = name
      ? await ProductModel.findByName(String(name))
      : await ProductModel.findAll();

    return res.status(200).json({
      data: products,
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    logger.http("GET /products/:id", { id });

    const product = await ProductModel.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return res.status(200).json({
      data: product,
    });
  },

  async create(req: Request, res: Response) {
    const data = createProductSchema.parse(req.body);

    if (!req.file) {
      throw new AppError("Imagem é obrigatória", 400);
    }

    const existing = await ProductModel.findByName(data.name);

    if (existing) {
      throw new AppError("Produto já cadastrado", 409);
    }

    const product = await ProductModel.create({
      ...data,
      file: req.file,
    });

    logger.success("POST /products", {
      name: data.name,
    });

    return res.status(201).json({
      data: product,
    });
  },

  async update(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const data = updateProductSchema.parse(req.body);

    logger.http("PUT /products/:id", {
      id,
    });

    const existing = await ProductModel.findById(id);

    if (!existing) {
      throw new AppError("Produto não encontrado", 404);
    }

    const product = await ProductModel.update(id, data);

    return res.status(200).json({
      data: product,
    });
  },

  async remove(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    logger.warn("DELETE /products/:id", {
      id,
    });

    const existing = await ProductModel.findById(id);

    if (!existing) {
      throw new AppError("Produto não encontrado", 404);
    }

    await ProductModel.delete(id);

    return res.status(200).json({
      success: true,
      message: "Produto removido com sucesso",
    });
  },
};
