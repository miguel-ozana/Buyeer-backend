import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface MyJwtPayload extends JwtPayload {
  id: string;
}


// Middleware de autenticação
const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Token is required');
  }

  // Verifica se process.env.JWT_SECRET está definido antes de chamar jwt.verify
  if (!process.env.JWT_SECRET) {
    return res.status(500).send('JWT secret is not defined');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // Defina o tipo de retorno como JwtPayload
    req.user = { id: decoded.id }; // Atribua o id do usuário decodificado à propriedade 'user'
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

export default authenticate;
