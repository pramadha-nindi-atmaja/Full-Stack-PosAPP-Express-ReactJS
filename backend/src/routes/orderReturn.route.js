import { Router } from "express";
import { insertOrderReturn } from "../controllers/orderReturn.controller.js";
import { authenticate } from "../controllers/error.controller.js";
const orderReturnRouter = Router();

orderReturnRouter.post("/order-returns", authenticate, insertOrderReturn);

export default orderReturnRouter;
