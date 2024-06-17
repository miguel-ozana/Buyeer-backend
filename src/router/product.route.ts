import { Router } from "express";
import { z } from "zod";
export const productRoute = Router();

import { authenticateUser } from "../middleware/authenticate";
import { prisma } from "../lib/prisma.lib";

productRoute.use(authenticateUser);

productRoute.get("/:productId", async (req, res) => {
  const paramsSchema = z.object({
    productId: z.string(),
  });

  const { productId } = paramsSchema.parse(req.params);
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).send(product);
});

productRoute.post("/", async (req, res) => {
  const cartSchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().min(1),
    description: z.string(),
    cartId: z.string().uuid(),
  });

  const { name, price, quantity, description, cartId } = cartSchema.parse(
    req.body
  );

  await prisma.product.create({
    data: {
      name,
      price,
      quantity,
      cartId,
    },
  });

  return res.status(201).send();
});

productRoute.delete("/:productId", async (req, res) => {
  const paramsSchema = z.object({
    productId: z.string(),
  });

  const { productId } = paramsSchema.parse(req.params);

  try {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: "Product not found" });
  }
});

productRoute.patch("/:productId", async (request, response) => {
  const findProductSchema = z.object({
    productId: z.string(),
  });

  const cartSchema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
  });

  const { productId } = findProductSchema.parse(request.params);
  const product = cartSchema.parse(request.body);

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: { ...product },
  });

  return response.status(204).send();
});
