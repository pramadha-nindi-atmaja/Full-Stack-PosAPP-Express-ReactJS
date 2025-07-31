import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";

export const getCartByProductId = async (req, res) => {
  const param = req.params;
  if (!param.id || !param.userId) {
    return res.status(400).json({
      message: "Invalid input: Missing productId or userId",
      result: null,
    });
  }
  try {
    const result = await prisma.carts.findMany({
      where: {
        productId: Number(param.id),
        userId: Number(param.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result: result[0],
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:getCartByProductId - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllCart = async (req, res) => {
  try {
    const result = await prisma.carts.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:getAllCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const createCart = async (req, res) => {
  const { price, productName, qty, totalPrice, note, productId, userId } =
    req.body;

  if (!price || !productName || !qty || !totalPrice || !productId || !userId) {
    return res.status(400).json({
      message: "Invalid input: Missing required fields",
      result: null,
    });
  }

  try {
    const result = await prisma.carts.create({
      data: {
        price,
        productName,
        qty,
        totalPrice,
        note,
        productId,
        userId,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:createCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateCart = async (req, res) => {
  const { price, productName, qty, totalPrice, note, productId, userId } =
    req.body;

  if (!price || !productName || !qty || !totalPrice || !productId || !userId || !req.params.id) {
    return res.status(400).json({
      message: "Invalid input: Missing required fields or cart ID",
      result: null,
    });
  }

  try {
    const result = await prisma.carts.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        price: Number(price),
        productName,
        qty: Number(qty),
        totalPrice: Number(totalPrice),
        note,
        productId: Number(productId),
        userId,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:updateCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteCart = async (req, res) => {
  const param = req.params;
  if (!param.id || !param.userId) {
    return res.status(400).json({
      message: "Invalid input: Missing cart ID or user ID",
      result: null,
    });
  }
  try {
    const result = await prisma.carts.delete({
      where: {
        id: Number(param.id),
        userId: Number(param.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:deleteCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteAllCart = async (req, res) => {
  if (!req.params.userId) {
    return res.status(400).json({
      message: "Invalid input: Missing user ID",
      result: null,
    });
  }
  try {
    const result = await prisma.carts.deleteMany({
      where: {
        userId: Number(req.params.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:deleteAllCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};