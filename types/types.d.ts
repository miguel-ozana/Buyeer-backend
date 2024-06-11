// types.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string }; // Adicione outras propriedades necessárias aqui
  }
}
