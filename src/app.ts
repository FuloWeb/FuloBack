import express from "express";
import { logger } from "./config/logger.js";
import router from "./routes/router.js";
import session from "express-session";
import cors from "cors";

export const app = express();
const PORT = process.env.PORT || 8000;
const sessionSecret = process.env.SESSION_SECRET;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

if (!sessionSecret) {
  throw new Error(
    "SESSION_SECRET não definido",
  );
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2,
    },
  }),
);
app.use(router);

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
