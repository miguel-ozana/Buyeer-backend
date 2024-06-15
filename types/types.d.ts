// types.d.ts
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string }; // Adicione outras propriedades necessárias aqui
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    prisma: PrismaClient;
  }
}