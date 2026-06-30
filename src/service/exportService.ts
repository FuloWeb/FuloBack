import PDFDocument from "pdfkit";
import path from "path";
import { Response } from "express";

const header = path.join(process.cwd(), "public", "logo.png");

export const PdfService = {
  generateMissingProductsPdf(res: Response, products: any[]) {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="produtos-faltantes.pdf"',
    );

    doc.pipe(res);
    doc.image(header, {
      fit: [120, 120],
      align: "center",
    });

    doc.font("Helvetica-Bold");
    doc.fontSize(18).text("RELATÓRIO DE PRODUTOS FALTANTES - Maria Fulô");
    doc.moveDown();

    products.forEach((product) => {
      doc.font("Helvetica");
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
    doc.image(header, {
      fit: [120, 120],
      align: "center",
    });

    doc.moveDown(2);
    doc.font("Helvetica-Bold");
    doc.fontSize(18).text("RELATÓRIO DE COMPRAS POR CLIENTE - Maria Fulô", {
      align: "center"
    });

    doc.moveDown();

    data.forEach((row) => {
      doc.font("Helvetica");
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
    doc.image(header, {
      fit: [120, 120],
      align: "center",
    });
    doc.font("Helvetica-Bold");
    doc.fontSize(18).text("RELATÓRIO DE RECEITA DIÁRIA - Maria Fulô");
    doc.moveDown();

    data.forEach((row) => {
      doc.font("Helvetica");
      doc.text(`${row.date} - R$ ${row.total.toFixed(2)}`);
    });

    doc.end();
  },
};
