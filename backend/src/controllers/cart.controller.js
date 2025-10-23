import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";

/**
 * Get cart by productId and userId
 */
export const getCartByProductId = async (req, res) => {
  const { id: productId, userId } = req.params;

  if (!productId || !userId) {
    return res.status(400).json({
      message: "Invalid input: Missing productId or userId",
      result: null,
    });
  }

  try {
    const cart = await prisma.carts.findFirst({
      where: {
        productId: Number(productId),
        userId: Number(userId),
      },
    });

    return res.status(200).json({
      message: "success",
      result: cart,
    });
  } catch (error) {
    logger.error(`getCartByProductId - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Get all carts (admin use)
 */
export const getAllCart = async (req, res) => {
  try {
    const carts = await prisma.carts.findMany({
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      message: "success",
      result: carts,
    });
  } catch (error) {
    logger.error(`getAllCart - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Create new cart
 */
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
    const newCart = await prisma.carts.create({
      data: {
        price: Number(price),
        productName,
        qty: Number(qty),
        totalPrice: Number(totalPrice),
        note: note || "",
        productId: Number(productId),
        userId: Number(userId),
      },
    });

    return res.status(201).json({
      message: "success",
      result: newCart,
    });
  } catch (error) {
    logger.error(`createCart - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Update cart by ID
 */
export const updateCart = async (req, res) => {
  const { id } = req.params;
  const { price, productName, qty, totalPrice, note, productId, userId } =
    req.body;

  if (!id || !price || !productName || !qty || !totalPrice || !productId || !userId) {
    return res.status(400).json({
      message: "Invalid input: Missing required fields or cart ID",
      result: null,
    });
  }

  try {
    const existingCart = await prisma.carts.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCart) {
      return res.status(404).json({
        message: "Cart not found",
        result: null,
      });
    }

    const updatedCart = await prisma.carts.update({
      where: { id: Number(id) },
      data: {
        price: Number(price),
        productName,
        qty: Number(qty),
        totalPrice: Number(totalPrice),
        note: note || "",
        productId: Number(productId),
        userId: Number(userId),
      },
    });

    return res.status(200).json({
      message: "success",
      result: updatedCart,
    });
  } catch (error) {
    logger.error(`updateCart - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Delete single cart
 */
export const deleteCart = async (req, res) => {
  const { id, userId } = req.params;

  if (!id || !userId) {
    return res.status(400).json({
      message: "Invalid input: Missing cart ID or user ID",
      result: null,
    });
  }

  try {
    const existingCart = await prisma.carts.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCart) {
      return res.status(404).json({
        message: "Cart not found",
        result: null,
      });
    }

    await prisma.carts.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: "success",
      result: null,
    });
  } catch (error) {
    logger.error(`deleteCart - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Delete all carts for a user
 */
export const deleteAllCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "Invalid input: Missing user ID",
      result: null,
    });
  }

  try {
    const result = await prisma.carts.deleteMany({
      where: { userId: Number(userId) },
    });

    return res.status(200).json({
      message: "success",
      deletedCount: result.count,
    });
  } catch (error) {
    logger.error(`deleteAllCart - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};
