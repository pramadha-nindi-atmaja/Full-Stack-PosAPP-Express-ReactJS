import { Router } from "express";
import {
  createCart,
  deleteAllCart,
  deleteCart,
  getAllCart,
  getCartByProductId,
  updateCart,
} from "../controllers/cart.controller.js";
import { authenticate } from "../controllers/error.controller.js";
const cartRoute = Router();

cartRoute.get("/carts/product/:id/:userId", authenticate, getCartByProductId);
cartRoute.get("/carts", authenticate, getAllCart);
cartRoute.post("/carts", authenticate, createCart);
cartRoute.put("/carts/:id", authenticate, updateCart);
cartRoute.delete("/carts/:id/:userId", authenticate, deleteCart);
cartRoute.delete("/carts/:userId", authenticate, deleteAllCart);

export default cartRoute;
