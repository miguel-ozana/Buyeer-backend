import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const deviceDbMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const deviceId = req.headers['x-device-id'] as string;
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const dbPath = path.join(__dirname, `../databases/${deviceId}.db`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
  });

  // Attach prisma to the request object
  req.prisma = prisma;

  // Clean up prisma instance after response is finished
  res.on('finish', () => {
    prisma.$disconnect();
  });

  next();
};
