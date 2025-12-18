import { Router } from "express";
import {
  createSupplier,
  deleteSupplier,
  generateExcel,
  generatePdf,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplier.controller.js";
import { authenticate } from "../controllers/error.controller.js";
const supplierRoute = Router();

supplierRoute.get("/suppliers", authenticate, getAllSupplier);
supplierRoute.get("/suppliers/:id", authenticate, getSupplierById);
supplierRoute.post("/suppliers", authenticate, createSupplier);
supplierRoute.put("/suppliers/:id", authenticate, updateSupplier);
supplierRoute.delete("/suppliers/:id", authenticate, deleteSupplier);
supplierRoute.get("/suppliers-pdf", authenticate, generatePdf);
supplierRoute.get("/suppliers-excel", authenticate, generateExcel);

export default supplierRoute;
