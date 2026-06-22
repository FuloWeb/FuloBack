import { Router } from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js"
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productsRoutes.js";
import reportRoutes from "./reportsRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/products", productRoutes);
router.use("/reports", reportRoutes);

export default router;