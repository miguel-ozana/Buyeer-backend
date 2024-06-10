import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar os itens:', error);
    res.status(500).json({ error: 'Erro ao buscar os itens' });
  }
});

router.post('/items', async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        quantity,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Erro ao criar um novo item:', error);
    res.status(500).json({ error: 'Erro ao criar um novo item' });
  }
});

router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const updatedItem = await prisma.item.update({
      where: { id: id.toString() }, // Convertendo para string
      data: { name, quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar o item:', error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }
});

router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({ where: { id: id.toString() } }); // Convertendo para string
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
});


export default router;
