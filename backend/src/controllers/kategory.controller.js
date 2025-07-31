import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { categoryValidation } from "../validations/category.validation.js";

export const getAllCategory = async (req, res) => {
  try {
    const result = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(`controllers/category.controller.js:getAllCategory - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!result) {
      return res.status(404).json({
        message: "Category not found",
        result: null,
      });
    }
    
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(`controllers/category.controller.js:getCategoryById - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const createCategory = async (req, res) => {
  const { error, value } = categoryValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  
  try {
    const result = await prisma.category.create({
      data: {
        kategoryName: value.kategoryName,
      },
    });
    return res.status(201).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(`controllers/category.controller.js:createCategory - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { error, value } = categoryValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  
  try {
    const id = Number(req.params.id);
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        result: null,
      });
    }
    
    const result = await prisma.category.update({
      where: { id },
      data: {
        kategoryName: value.kategoryName,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(`controllers/category.controller.js:updateCategory - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        result: null,
      });
    }
    
    const result = await prisma.category.delete({
      where: { id },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(`controllers/category.controller.js:deleteCategory - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};