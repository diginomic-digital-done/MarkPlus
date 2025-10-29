import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const region = await prisma.region.findUnique({
          where: { id: parseInt(id) },
          select: {
            id: true,
            name: true,
            code: true,
            isActive: true,
            stateId: true,
            pdfStaticPages: true,
          },
        });
        if (!region) {
          return res.status(404).json({ error: 'Region not found' });
        }
        res.status(200).json(region);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch region' });
      }
      break;

    case 'PUT':
      try {
        const { name, code, isActive, stateId, pdfStaticPages } = req.body;
        const updatedRegion = await prisma.region.update({
          where: { id: parseInt(id) },
          data: {
            name,
            code,
            isActive,
            stateId: stateId ? parseInt(stateId) : undefined,
            pdfStaticPages: Array.isArray(pdfStaticPages) ? pdfStaticPages : [],
          },
        });
        res.status(200).json(updatedRegion);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update region' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.region.delete({
          where: { id: parseInt(id) },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete region' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}