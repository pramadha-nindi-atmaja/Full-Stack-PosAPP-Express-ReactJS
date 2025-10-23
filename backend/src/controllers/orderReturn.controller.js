import prisma from "../utils/client.js";
import { setOrderCode } from "../utils/documentPatern.js";
import { logger } from "../utils/winston.js";
import { orderReturnValidation } from "../validations/orderReturn.validation.js";

/**
 * Insert a new order return with detail and stock update
 */
export const insertOrderReturn = async (req, res) => {
  // Validate input
  const { error, value } = orderReturnValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }

  if (!Array.isArray(value.detail) || value.detail.length === 0) {
    return res.status(400).json({
      message: "Invalid input: order return must include at least one detail item",
      result: null,
    });
  }

  try {
    const orderReturn = await prisma.$transaction(async (tx) => {
      // Create order return master
      const createdReturn = await tx.orderreturn.create({
        data: {
          code: setOrderCode("ORDR-"),
          date: value.date,
          note: value.note || "",
          userId: Number(value.userId),
          orderId: Number(value.orderId),
        },
      });

      // Validate and prepare details
      const detailPromises = value.detail.map(async (item) => {
        if (
          !item.qty ||
          Number(item.qty) <= 0 ||
          !item.product ||
          !item.product.productId
        ) {
          throw new Error("Each return item must have a valid product and quantity > 0");
        }

        // Insert detail
        await tx.orderreturndetail.create({
          data: {
            productId: Number(item.product.productId),
            productName: item.product.productName,
            price: Number(item.product.price),
            qty: Number(item.qty),
            total: Number(item.totalPrice),
            returnId: createdReturn.id,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: Number(item.product.productId) },
          data: {
            qty: { increment: Number(item.qty) },
          },
        });
      });

      await Promise.all(detailPromises);

      return createdReturn;
    });

    return res.status(201).json({
      message: "Order return created successfully",
      result: orderReturn,
    });
  } catch (error) {
    logger.error(
      `insertOrderReturn - ${error.message}`
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};
