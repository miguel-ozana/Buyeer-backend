// src/router/router.ts
/// <reference path="../../types/types.d.ts" />
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const router = Router();
const prisma = PrismaClient

router.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await req.prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

router.get('/items/:itemId', async (req: Request, res: Response) => {
  const { itemId } = req.params;
  console.log(`Buscando detalhes do item com ID: ${itemId}`);

  try {
    const item = await req.prisma.item.findUnique({
      where: { id: parseInt(itemId, 10) },
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

router.post('/items', async (req: Request, res: Response) => {
  try {
    const { name, quantity } = req.body;
    if (!name || !quantity) {
      return res.status(400).json({ error: 'Nome e quantidade são obrigatórios' });
    }

    const newItem = await req.prisma.item.create({
      data: {
        name,
        quantity: parseInt(quantity, 10),
      },
    });
    res.json(newItem);
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
});

router.put('/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const updatedItem = await req.prisma.item.update({
      where: { id: parseInt(id, 10) },
      data: { name, quantity: parseInt(quantity, 10) },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar o item:', error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }
});

router.delete('/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await req.prisma.item.delete({ where: { id: parseInt(id, 10) } });
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
});

export default router;
