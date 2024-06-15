import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const cookiesRouter = Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'chave_secreta_default'; 

cookiesRouter.get('/api/token', (req: Request, res: Response) => {
  try {
    const deviceId = `device_${Date.now()}`;
    const token = jwt.sign({ deviceId }, SECRET_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.json({ token });
  } catch (err) {
    console.error('Erro ao gerar token JWT:', err);
    res.status(500).json({ error: 'Erro ao gerar token JWT' });
  }
});

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token as string;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar token JWT:', err);
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Adicione o payload decodificado ao objeto Request para uso posterior
    (req as any).payload = decoded;
    next();
  });
}

cookiesRouter.get('/api/protegido', verifyToken, (req: Request, res: Response) => {
  const deviceId = (req as any).payload?.deviceId as string;
  res.json({ message: `Acesso autorizado para o dispositivo ${deviceId}` });
});

export default cookiesRouter;
