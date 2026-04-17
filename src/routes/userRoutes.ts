import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "../config/logger.js";

const userRouter: Router = Router();

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

userRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    logger.info("GET /users");

    return res.status(200).json({
      data: [],
      meta: { total: 0 },
    });
  })
);

userRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = idSchema.parse(req.params);

    logger.info("GET /users/:id", { id });

    return res.status(200).json({
      data: { id },
    });
  })
);

userRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const data = userSchema.parse(req.body);

    logger.info("POST /users", data);

    return res.status(201).json({
      data,
    });
  })
);

userRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = idSchema.parse(req.params);
    const data = userSchema.partial().parse(req.body);

    logger.info("PUT /users/:id", { id, ...data });

    return res.status(200).json({
      data: { id, ...data },
    });
  })
);

userRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = idSchema.parse(req.params);

    logger.warn("DELETE /users/:id", { id });

    return res.status(204).send();
  })
);

export default userRouter;