// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import itemRoutes from './router/router';
import { deviceDbMiddleware } from './middleware/deviceDbMiddleware';

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
app.use(deviceDbMiddleware); // Use the middleware here
app.use('/api', itemRoutes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
