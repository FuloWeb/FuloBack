import express from "express";
import dotenv from "dotenv";
import { logger } from "./config/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "API - TS rodando" });
});

app.get("/test", (req, res) => {
  logger.info("Rota /test acessada");
  return res.json({ ok: true });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Erro não tratado", {
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
});

const server = app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta: ${PORT}`);
});

process.on("SIGINT", () => {
  logger.warn("SIGINT recebido. Encerrando servidor...");
  server.close(() => {
    logger.info("Servidor encerrado com sucesso");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  logger.warn("SIGTERM recebido. Encerrando servidor...");
  server.close(() => {
    logger.info("Servidor encerrado com sucesso");
    process.exit(0);
  });
});