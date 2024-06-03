import express from 'express';
import { PrismaClient } from '@prisma/client';
import routes from './router/router';
import dotenv from "dotenv"

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000

app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
});
