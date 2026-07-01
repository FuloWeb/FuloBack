import { Request, Response } from "express";
import { z, ZodError } from "zod";

import { ProductModel } from "../models/products.js";
import { OrderModel } from "../models/order.js";
import { PdfService } from "../service/exportService.js";
import { logger } from "../config/logger.js";

const periodSchema = z.object({
  start: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Data inicial inválida",
  }),
  end: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Data final inválida",
  }),
}).refine((d) => new Date(d.end) >= new Date(d.start), {
  message: "Data final deve ser maior ou igual à data inicial",
  path: ["end"],
});

export const ReportController = {
  async missingProducts(req: Request, res: Response) {
    try {
      const products = await ProductModel.findOutOfStock();
      PdfService.generateMissingProductsPdf(res, products);
    } catch (error) {
      logger.error("Erro ao gerar relatório de produtos faltantes", error);

      if (!res.headersSent) {
        return res.status(500).json({ error: "Erro ao gerar relatório." });
      }
    }
  },

  async salesByClient(req: Request, res: Response) {
    try {
      const { start, end } = periodSchema.parse(req.query);

      const startDate = new Date(start);
      // Inclui o dia inteiro da data final
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      const data = await OrderModel.salesByClient(startDate, endDate);
      PdfService.generateSalesByClientPdf(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Parâmetros inválidos.",
          details: error.flatten(),
        });
      }

      logger.error("Erro ao gerar relatório de vendas por cliente", error);

      if (!res.headersSent) {
        return res.status(500).json({ error: "Erro ao gerar relatório." });
      }
    }
  },

  async dailyRevenue(req: Request, res: Response) {
    try {
      const { start, end } = periodSchema.parse(req.query);

      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      const data = await OrderModel.dailyRevenue(startDate, endDate);
      PdfService.generateDailyRevenuePdf(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Parâmetros inválidos.",
          details: error.flatten(),
        });
      }

      logger.error("Erro ao gerar relatório de receita diária", error);

      if (!res.headersSent) {
        return res.status(500).json({ error: "Erro ao gerar relatório." });
      }
    }
  },
};
