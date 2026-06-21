import PDFDocument from "pdfkit";
import { Response } from "express";

export const PdfService = {
  generateMissingProductsPdf(res: Response, products: any[]) {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="produtos-faltantes.pdf"',
    );

    doc.pipe(res);
    doc.fontSize(18).text("RELATÓRIO DE PRODUTOS FALTANTES - Maria Fulô");
    doc.moveDown();

    products.forEach((product) => {
      doc.text(`${product.id} - ${product.name}`);

      doc.text(`Quantidade: ${product.quantity}`);

      doc.moveDown();
    });

    doc.end();
  },

  generateSalesByClientPdf(
    res: Response,
    data: {
      clientName: string;
      total: number;
    }[],
  ) {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="compras-por-cliente.pdf"',
    );

    doc.pipe(res);
    doc.fontSize(18).text("RELATÓRIO DE COMPRAS POR CLIENTE - Maria Fulô");
    doc.moveDown();

    data.forEach((row) => {
      doc.text(`${row.clientName} - R$ ${row.total.toFixed(2)}`);
    });

    doc.end();
  },

  generateDailyRevenuePdf(
    res: Response,
    data: {
      date: string;
      total: number;
    }[],
  ) {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="receita-diaria.pdf"',
    );

    doc.pipe(res);
    doc.fontSize(18).text("RELATÓRIO DE RECEITA DIÁRIA - Maria Fulô");
    doc.moveDown();

    data.forEach((row) => {
      doc.text(`${row.date} - R$ ${row.total.toFixed(2)}`);
    });

    doc.end();
  },
};
