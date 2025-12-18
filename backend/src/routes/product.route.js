import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  generateExcel,
  generatePdf,
  getAllProduct,
  getProductByCategory,
  getProductById,
  getLowStockProducts,
  updateProduct,
  bulkImportProducts,
} from "../controllers/product.controller.js";
import { authenticate } from "../controllers/error.controller.js";
import { bulkImportLimiter } from "../middleware/rateLimiter.js";
const productRoute = Router();

productRoute.get("/products", authenticate, getAllProduct);
productRoute.get("/products/:id", authenticate, getProductById);
productRoute.get("/products/category/:id", authenticate, getProductByCategory);
productRoute.get("/products-low-stock", authenticate, getLowStockProducts);
productRoute.post("/products", authenticate, createProduct);
productRoute.post("/products-bulk-import", bulkImportLimiter, authenticate, bulkImportProducts);
productRoute.put("/products/:id", authenticate, updateProduct);
productRoute.delete("/products/:id", authenticate, deleteProduct);
productRoute.get("/products-pdf", authenticate, generatePdf);
productRoute.get("/products-excel", authenticate, generateExcel);

export default productRoute;