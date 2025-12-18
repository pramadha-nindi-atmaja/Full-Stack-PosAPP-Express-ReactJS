import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  loginUser,
  setRefreshToken,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../controllers/error.controller.js";
const userRoute = Router();

userRoute.post("/users", createUser);
userRoute.put("/users/:id", authenticate, updateUser);
userRoute.delete("/users/:id", authenticate, deleteUser);
userRoute.get("/users", authenticate, getAllUser);
userRoute.get("/users/refresh", setRefreshToken);
userRoute.post("/users/login", loginUser);
userRoute.get("/users/:id", authenticate, getUserById);

export default userRoute;
