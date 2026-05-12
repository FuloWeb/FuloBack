import express from "express";
import { logger } from "./config/logger.js";
import router from "./routes/router.js";

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(router)

app.get("/", (req, res) => {
  return res.json({ message: `Servidor rodando na porta ${PORT}` });
});

app.get("/test", (req, res) => {
  logger.info("Rota /test acessada");
  return res.json({ ok: true });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error("Erro não tratado", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  },
);
