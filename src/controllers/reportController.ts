import { Request, Response } from "express";
import { z } from "zod";

import { ProductModel } from "../models/products.js";
import { OrderModel } from "../models/order.js";
import { PdfService } from "../service/exportService.js";

const periodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const ReportController = {
  // @ Produtos fora do estoque
  async missingProducts(req: Request, res: Response) {
    const products = await ProductModel.findOutOfStock();

    PdfService.generateMissingProductsPdf(res, products);
  },

  // @ Total de compras por cliente
  async salesByClient(req: Request, res: Response) {
    const { start, end } = periodSchema.parse(req.query);

    const data = await OrderModel.salesByClient(new Date(start), new Date(end));

    PdfService.generateSalesByClientPdf(res, data);
  },

  // @ Vendas por um período (por dia)
  async dailyRevenue(req: Request, res: Response) {
    const { start, end } = periodSchema.parse(req.query);

    const data = await OrderModel.dailyRevenue(new Date(start), new Date(end));

    PdfService.generateDailyRevenuePdf(res, data);
  },
};
