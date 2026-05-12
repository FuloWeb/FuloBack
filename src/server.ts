import "dotenv/config";

import { app } from "./app.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 3000;

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