import { Router } from "express";
import { z } from "zod";
export const cartRoute = Router();

import { prisma } from "../lib/prisma.lib";
import { authenticateUser } from "../middleware/authenticate";

cartRoute.use(authenticateUser);

cartRoute.get("/", async (request, response) => {
  const { userId } = request;

  const searchCartSchema = z.object({
    title: z.string().optional(),
  });

  const { title } = searchCartSchema.parse(request.query);

  const carts = await prisma.cart.findMany({
    where: {
      title: {
        contains: title,
      },
      userId,
    },
  });

  return response.status(200).json(carts);
});

cartRoute.get("/:cartId", async (request, response) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const { cartId } = findCartSchema.parse(request.params);
  const { userId } = request;

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      id: cartId,
      userId,
    },
  });

  if (!cart) {
    return response.status(404).json({ error: "Cart not found" });
  }

  return response.status(200).json(cart);
});

cartRoute.get("/:cartId/products", async (request, response) => {
  const cartIdSchema = z.object({
    cartId: z.string().uuid(),
  });

  const { cartId } = cartIdSchema.parse(request.params);

  const products = await prisma.product.findMany({
    where: {
      cartId,
    },
  });

  return response.status(200).send(products);
});

cartRoute.post("/", async (request, response) => {
  const { userId } = request;

  const cartSchema = z.object({
    title: z.string(),
    limit: z.number().min(0),
  });

  const { limit, title } = cartSchema.parse(request.body);

  await prisma.cart.create({
    data: {
      title,
      limit,
      userId: userId as string,
    },
  });

  return response.status(201).send();
});

cartRoute.patch("/:cartId", async (request, response) => {
  const findCartSchema = z.object({
    cartId: z.string(),
  });

  const cartSchema = z.object({
    title: z.string().optional(),
    limit: z.number().optional(),
  });

  const cart = cartSchema.parse(request.body);
  const { cartId } = findCartSchema.parse(request.params);

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: { ...cart },
  });

  return response.status(204).send();
});

cartRoute.delete("/:cartId", async (req, res) => {
  const paramsSchema = z.object({
    cartId: z.string(),
  });

  const { cartId } = paramsSchema.parse(req.params);

  try {
    await prisma.cart.delete({
      where: {
        id: cartId,
        userId: req.userId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: "Cart not found" });
  }
});
