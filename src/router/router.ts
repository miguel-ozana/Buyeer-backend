import { Router, Request, Response } from 'express';
import { prismaMiddleware } from '../middleware/prismaMiddleware';

const router = Router();

router.use(prismaMiddleware);

router.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await req.prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar os itens:', error);
    res.status(500).json({ error: 'Erro ao buscar os itens' });
  }
});

router.get('/items/:itemId', async (req: Request, res: Response) => {
  const { itemId } = req.params;
  console.log(`Buscando detalhes do item com ID: ${itemId}`);

  try {
    const item = await req.prisma.item.findUnique({
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

router.post('/items', async (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  try {
    const newItem = await req.prisma.item.create({
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

router.put('/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const updatedItem = await req.prisma.item.update({
      where: { id: id.toString() }, // Convertendo para string
      data: { name, quantity },
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
    await req.prisma.item.delete({ where: { id: id.toString() } }); // Convertendo para string
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar o item:', error);
    res.status(500).json({ error: 'Erro ao deletar o item' });
  }
});

export default router;
