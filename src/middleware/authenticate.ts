/// <reference path="../../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const checkUser = verify(token, String(process.env.SECRET_KEY));
    req.userId = checkUser.sub as string;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(400).json({ message: "Expired token" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}
