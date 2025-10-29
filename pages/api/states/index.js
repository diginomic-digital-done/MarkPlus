import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const states = await prisma.state.findMany();
        res.status(200).json(states);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch states', details: error.message });
      }
      break;
    case 'POST':
      try {
        const { name, code, isActive } = req.body;
        if (!name || !code || typeof isActive === 'undefined') {
          return res.status(400).json({ error: 'Missing required fields: name, code, isActive' });
        }
        const newState = await prisma.state.create({
          data: { name, code, isActive },
        });
        res.status(201).json(newState);
      } catch (error) {
        console.error('State creation error:', error);
        res.status(500).json({ error: 'Failed to create state', details: error.message, stack: error.stack });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
