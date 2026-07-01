import PDFDocument from "pdfkit";
import path from "path";
import { Response } from "express";

const header = path.join(process.cwd(), "public", "logo.jpeg");

const setupPdf = (res: Response, filename: string) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  doc.pipe(res);
  return doc;
};

const addHeader = (doc: PDFKit.PDFDocument, title: string) => {
  try {
    doc.image(header, { fit: [100, 100], align: "center" });
  } catch {
    // Logo ausente não quebra o relatório
  }

  doc.moveDown(1);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(title, { align: "center" });

  doc.moveDown(2);
};

const addEmptyMessage = (doc: PDFKit.PDFDocument) => {
  doc
    .font("Helvetica")
    .fontSize(12)
    .text("Nenhum registro encontrado.", { align: "center" });
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const PdfService = {
  generateMissingProductsPdf(
    res: Response,
    products: { id: number; name: string; quantity: number }[],
  ) {
    const doc = setupPdf(res, "produtos-faltantes.pdf");

    addHeader(doc, "RELATÓRIO DE PRODUTOS FALTANTES - Maria Fulô");

    if (products.length === 0) {
      addEmptyMessage(doc);
    } else {
      products.forEach((product) => {
        doc
          .font("Helvetica")
          .fontSize(12)
          .text(`${product.id} - ${product.name}`)
          .text(`Quantidade: ${product.quantity}`)
          .moveDown();
      });
    }

    doc.end();
  },

  generateSalesByClientPdf(
    res: Response,
    data: { clientName: string; total: number }[],
  ) {
    const doc = setupPdf(res, "compras-por-cliente.pdf");

    addHeader(doc, "RELATÓRIO DE COMPRAS POR CLIENTE - Maria Fulô");

    if (data.length === 0) {
      addEmptyMessage(doc);
    } else {
      data.forEach((row) => {
        doc
          .font("Helvetica")
          .fontSize(12)
          .text(`${row.clientName} - ${formatCurrency(row.total)}`)
          .moveDown();
      });
    }

    doc.end();
  },

  generateDailyRevenuePdf(
    res: Response,
    data: { date: string; total: number }[],
  ) {
    const doc = setupPdf(res, "receita-diaria.pdf");

    addHeader(doc, "RELATÓRIO DE RECEITA DIÁRIA - Maria Fulô");

    if (data.length === 0) {
      addEmptyMessage(doc);
    } else {
      data.forEach((row) => {
        doc
          .font("Helvetica")
          .fontSize(12)
          .text(
            `${new Date(row.date).toLocaleDateString("pt-BR")} - ${formatCurrency(row.total)}`
          )
          .moveDown();
      });
    }

    doc.end();
  },
};
