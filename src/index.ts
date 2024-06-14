import express from 'express';
import { PrismaClient } from '@prisma/client';
import routes from './router/router';
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

const corsOptions = { 
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'X-Access-Token']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
