import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // List all zones
      try {
        const zones = await prisma.zone.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(zones);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch zones.' });
      }
      break;
    case 'POST':
      // Add a new zone
      try {
        const { name, label, isActive } = req.body;
        if (!name || !label) {
          return res.status(400).json({ error: 'Name and label are required.' });
        }
        const zone = await prisma.zone.create({
          data: { name, label, isActive: isActive !== false }
        });
        res.status(201).json(zone);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create zone.' });
      }
      break;
    case 'PUT':
      // Edit a zone
      try {
        const { id, name, label, isActive } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required.' });
        }
        const zone = await prisma.zone.update({
          where: { id: Number(id) },
          data: { name, label, isActive }
        });
        res.status(200).json(zone);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to update zone.' });
      }
      break;
    case 'DELETE':
      // Delete a zone
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID is required.' });
        }
        await prisma.zone.delete({ where: { id: Number(id) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to delete zone.' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
