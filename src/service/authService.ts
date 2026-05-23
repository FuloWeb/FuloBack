import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../database/prisma.js";
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
      logger.warn("POST /auth/register", { usuarioExistente });
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
      user: {
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
    const { email, password } = req.body;

    logger.http("POST /auth/login", {
      email,
    });

    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuario) {
      logger.warn(
        "POST /auth/login - Usuário não encontrado",
        { email },
      );

      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    const senhaValida = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!senhaValida) {
      logger.warn(
        "POST /auth/login - Senha inválida",
        {
          userId: usuario.id,
          email,
        },
      );

      return res.status(401).json({
        error: "Senha incorreta.",
      });
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

    return res.status(200).json({
      success: true,

      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
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