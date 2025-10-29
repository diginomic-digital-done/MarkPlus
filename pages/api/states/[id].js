import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const state = await prisma.state.findUnique({ where: { id: parseInt(id) } });
        if (!state) return res.status(404).json({ error: 'State not found' });
        res.status(200).json(state);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch state', details: error.message });
      }
      break;
    case 'PUT':
      try {
        const { name, code, isActive } = req.body;
        const updatedState = await prisma.state.update({
          where: { id: parseInt(id) },
          data: { name, code, isActive },
        });
        res.status(200).json(updatedState);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update state', details: error.message });
      }
      break;
    case 'DELETE':
      try {
        await prisma.state.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete state', details: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
