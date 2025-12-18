import { Router } from "express";
import {
  generateExcel,
  generatePdf,
  getAllOrder,
  getOrderById,
  insertOrder,
  purchaseYearly,
} from "../controllers/order.controller.js";
import { authenticate } from "../controllers/error.controller.js";
const orderRouter = Router();

orderRouter.post("/orders/:userId", authenticate, insertOrder);
orderRouter.get("/orders/:id", authenticate, getOrderById);
orderRouter.get("/orders", authenticate, getAllOrder);
orderRouter.post("/orders-pdf", authenticate, generatePdf);
orderRouter.post("/orders-excel", authenticate, generateExcel);
orderRouter.get("/orders-year", authenticate, purchaseYearly);

export default orderRouter;
