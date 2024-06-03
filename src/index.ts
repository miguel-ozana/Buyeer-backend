import express from 'express';
import { PrismaClient } from '@prisma/client';
import routes from './router/router';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
