import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/items', async (req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

router.post('/items', async (req, res) => {
  const { name, quantity } = req.body;
  const newItem = await prisma.item.create({
    data: {
      name,
      quantity,
    },
  });
  res.json(newItem);
});

router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const updatedItem = await prisma.item.update({
    where: { id },
    data: { name, quantity },
  });
  res.json(updatedItem);
});

router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.item.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;
