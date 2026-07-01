import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.js";
import { RegisterBody, LoginBody } from "../types/authRequest.js";

import { logger } from "../config/logger.js";

// MARK: - Registrar
export async function registrarUsuario(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<Response> {
  try {
    const { name, email, password, address } = req.body;

    logger.http("POST /auth/register", {
      email,
    });

    if (!name || !email || !password || !address) {
      logger.warn("POST /auth/register - Campos obrigatórios faltando");

      return res.status(400).json({
        error: "Campos obrigatórios faltando",
      });
    }

    const usuarioExistente = await UserModel.findByEmail(email);

    if (usuarioExistente) {
      logger.warn("POST /auth/register - Email já cadastrado", {
        email,
      });
      return res.status(409).json({
        error: "E-mail já cadastrado",
      });
    }

    const senhaHash = await bcrypt.hash(password, 12);

    const novoUsuario = await UserModel.create({
      name,
      email,
      password: senhaHash,
      address,
    });

    logger.success("POST /auth/register", {
      userId: novoUsuario.id,
      email: novoUsuario.email,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: novoUsuario.id,
        name: novoUsuario.name,
        email: novoUsuario.email,
        role: novoUsuario.role,
      },
    });
  } catch (error) {
    logger.error("POST /auth/register", { error });

    return res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
}

// MARK: - Autenticar
export async function autenticarUsuario(
  req: Request<{}, {}, LoginBody>,
  res: Response,
): Promise<Response> {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    logger.http("POST /auth/login", {
      email,
    });

    const usuario = await UserModel.findByEmail(email);

    if (!usuario) {
      logger.warn("POST /auth/login - Credenciais inválidas", {
        email,
      });

      return res.status(401).json({
        error: "Email ou senha inválidos.",
      });
    }

    const senhaValida = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!senhaValida) {
      logger.warn("POST /auth/login - Credenciais inválidas", {
        userId: usuario.id,
        email,
      });

      return res.status(401).json({
        error: "Email ou senha inválidos.",
      });
    }

    return await new Promise<Response>((resolve) => {
      req.session.regenerate((err) => {
        if (err) {
          logger.error(
            "POST /auth/login - Erro ao regenerar sessão",
            {
              error: err,
              email,
            },
          );

          return resolve(
            res.status(500).json({
              error: "Erro ao iniciar sessão.",
            }),
          );
        }

        req.session.user = {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role,
        };

        logger.success("POST /auth/login", {
          userId: usuario.id,
          email,
          sessionId: req.sessionID,
        });

        resolve(
          res.status(200).json({
            success: true,

            data: {
              id: usuario.id,
              name: usuario.name,
              email: usuario.email,
              role: usuario.role,
            },
          }),
        );
      });
    });
  } catch (error) {
    logger.error("POST /auth/login", {
      error,
    });

    return res.status(500).json({
      error: "Erro interno no servidor.",
    });
  }
}

// MARK: - Encerrar sessao
export async function encerrarSessao(
  req: Request,
  res: Response,
): Promise<void> {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        erro: "Não foi possível encerrar a sessão",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      mensagem: "Sessão encerrada com sucesso",
    });
  });
}
