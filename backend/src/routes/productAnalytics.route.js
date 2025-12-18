import { Router } from "express";
import { 
  getProductAnalytics,
  getLowStockAlerts
} from "../controllers/productAnalytics.controller.js";
import { authenticate } from "../controllers/error.controller.js";

const productAnalyticsRoute = Router();

productAnalyticsRoute.get("/product-analytics", authenticate, getProductAnalytics);
productAnalyticsRoute.get("/low-stock-alerts", authenticate, getLowStockAlerts);

export default productAnalyticsRoute;