import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router = Router();

// example
router.use("/users", userRoutes);

export default router;