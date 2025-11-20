import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // List all variation types
      try {
        const types = await prisma.variationType.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(types);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch variation types.' });
      }
      break;
    case 'POST':
      // Add a new variation type
      try {
        const { name, label, isActive } = req.body;
        if (!name || !label) {
          return res.status(400).json({ error: 'Name and label are required.' });
        }
        const type = await prisma.variationType.create({
          data: { name, label, isActive: isActive !== false }
        });
        res.status(201).json(type);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create variation type.' });
      }
      break;
    case 'PUT':
      // Edit a variation type
      try {
        const { id, name, label, isActive } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required.' });
        }
        const type = await prisma.variationType.update({
          where: { id: Number(id) },
          data: { name, label, isActive }
        });
        res.status(200).json(type);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to update variation type.' });
      }
      break;
    case 'DELETE':
      // Delete a variation type
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required.' });
        }
        await prisma.variationType.delete({ where: { id: Number(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to delete variation type.' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
