import { Router } from "express";
import { compare, hash } from "bcrypt";
import { z } from "zod";
export const userRoute = Router();

import { prisma } from "../lib/prisma.lib";
import { sign } from "jsonwebtoken";

userRoute.post("/", async (req, res) => {
  const cartSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = cartSchema.parse(req.body);

  const userSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userSameEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const passwordHashed = await hash(password, 8);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHashed,
    },
  });

  return res.status(201).json(user);
});

userRoute.post("/login", async (req, res) => {
  const cartSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = cartSchema.parse(req.body);

  try {
    const checkExistUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!checkExistUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const comparePass = await compare(password, checkExistUser.password);
    if (!comparePass) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = sign(
      {}, 
      String(process.env.SECRET_KEY), {
      subject: checkExistUser.id,
      expiresIn: "1d",
    }
  );

  return res.send({
    user: checkExistUser,
    token
  })
  } catch (error) {
    res.json(error);
  }
});
