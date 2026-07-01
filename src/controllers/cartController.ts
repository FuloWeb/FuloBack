import { Request, Response } from "express";
import { ZodError } from "zod";

import { CartModel } from "../models/cart.js";
import {
  addItemSchema,
  updateItemSchema,
  removeItemSchema,
} from "../validation/cartValidation.js";
import { logger } from "../config/logger.js";

export const CartController = {
  async get(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const cart = await CartModel.get(req.session.user.id);

      return res.json(cart);
    } catch (error) {
      logger.error("Erro ao buscar carrinho.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },

  async addItem(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const { productId, quantity } = addItemSchema.parse(req.body);

      const item = await CartModel.addItem(
        req.session.user.id,
        productId,
        quantity
      );

      return res.status(201).json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos.",
          details: error.flatten(),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      logger.error("Erro ao adicionar item ao carrinho.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },

  async updateItem(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const { productId, quantity } = updateItemSchema.parse(req.body);

      await CartModel.updateQuantity(
        req.session.user.id,
        productId,
        quantity
      );

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos.",
          details: error.flatten(),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      logger.error("Erro ao atualizar item do carrinho.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },

  async removeItem(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const { productId } = removeItemSchema.parse(req.params);

      await CartModel.removeItem(req.session.user.id, productId);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Parâmetros inválidos.",
          details: error.flatten(),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      logger.error("Erro ao remover item do carrinho.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },

  async clear(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      await CartModel.clear(req.session.user.id);

      return res.sendStatus(204);
    } catch (error) {
      logger.error("Erro ao esvaziar carrinho.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },

  async checkout(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const order = await CartModel.checkout(req.session.user.id);

      return res.status(200).json(order);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      logger.error("Erro ao finalizar pedido.", error);

      return res.status(500).json({
        error: "Erro interno do servidor.",
      });
    }
  },
};