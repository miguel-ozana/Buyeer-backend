/// <reference path="../../types/types.d.ts" />
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticate from '../middleware/autheticate'

const router = Router();
const prisma = new PrismaClient();

// Middleware de autenticação
router.use(authenticate);

// Rota para buscar todos os itens do usuário autenticado
router.get('/items', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const items = await prisma.item.findMany({
      where: { userId }
    });

    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar os itens:', error);
    res.status(500).json({ error: 'Erro ao buscar os itens' });
  }
});

// Rota para buscar detalhes de um item específico do usuário autenticado
router.get('/items/:itemId', async (req: Request, res: Response) => {
  const { itemId } = req.params;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const item = await prisma.item.findFirst({
      where: { id: itemId, userId }
    });

    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do item:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do item' });
  }
});

// Rota para criar um novo item para o usuário autenticado
router.post('/items', async (req: Request, res: Response) => {
  const { name, quantity } = req.body;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        quantity,
        user: { connect: { id: userId } }
      }
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Erro ao criar um novo item:', error);
    res.status(500).json({ error: 'Erro ao criar um novo item' });
  }
});

// Rota para atualizar um item específico do usuário autenticado
router.put('/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const updatedItem = await prisma.item.updateMany({
      where: { id, userId },
      data: { name, quantity },
    });

    if (updatedItem.count === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar o item:', error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }
});

// Rota para deletar um item específico do usuário autenticado
router.delete('/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const deletedItem = await prisma.item.deleteMany({
      where: { id, userId }
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
});

// Exporta o router com todas as rotas
export default router;

