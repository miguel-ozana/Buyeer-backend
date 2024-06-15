import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../utils/getDatabaseUrl';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const deviceId = req.headers['x-device-id'] as string;
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }
  const databaseUrl = getDatabaseUrl(deviceId);
  req.prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
  next();
};
