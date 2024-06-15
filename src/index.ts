// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { deviceDbMiddleware } from './middleware/deviceDbMiddleware';
import router from './router/router';
import cookiesrouter from './router/cookiesrouter';
import jwt from 'jsonwebtoken'; // Importe jwt do jsonwebtoken

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://buyeer.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'X-Device-ID']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(deviceDbMiddleware); // Use o middleware aqui
app.use('/api', router);
app.use(cookiesrouter);

// Exemplo de como você pode usar jwt.sign() para gerar um token
const secretKey = process.env.JWT_SECRET_KEY || 'chave_secreta_default'; // Certifique-se de ter uma chave padrão aqui

const payload = {
  userId: 123,
  username: 'exemplo',
  role: 'admin'
};

const token = jwt.sign(payload, secretKey);
console.log('Token JWT:', token);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
