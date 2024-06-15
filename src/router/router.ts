import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

router.get('/items/:itemId', async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId, 10); // Converter para número
  console.log(`Buscando detalhes do item com ID: ${itemId}`);

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId }
    });

    if (item) {
      console.log(`Item encontrado: ${JSON.stringify(item)}`);
      res.json(item);
    } else {
      console.log('Item não encontrado');
      res.status(404).send('Item não encontrado');
    }
  } catch (err) {
    console.error('Erro ao buscar detalhes do item:', err);
    res.status(500).send('Erro ao buscar detalhes do item');
  }
});

router.post('/items', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || !quantity) {
      return res.status(400).json({ error: 'Nome e quantidade são obrigatórios' });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        quantity
      }
    });
    res.json(newItem);
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
});

router.put('/items/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // Converter para número
  const { name, quantity } = req.body;
  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: { name, quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar o item:', error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }
});

router.delete('/items/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // Converter para número
  try {
    await prisma.item.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
});

export default router;
