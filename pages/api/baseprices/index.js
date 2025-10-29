import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const basePrices = await prisma.floorPlan.findMany({
          select: {
            id: true,
            name: true,
            basePrice: true,
          },
        });
        res.status(200).json(basePrices);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch base prices' });
      }
      break;

    case 'PUT':
      try {
        const { id, basePrice } = req.body;
        const updatedEntity = await prisma.floorPlan.update({
          where: { id },
          data: { basePrice },
        });
        res.status(200).json(updatedEntity);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update base price' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}