import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const variationOptions = await prisma.variationOption.findMany();
        res.status(200).json(variationOptions);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch variation options' });
      }
      break;

    case 'POST':
      try {
        const { name, floorPlanId, isActive } = req.body;
        const newVariationOption = await prisma.variationOption.create({
          data: { name, floorPlanId, isActive },
        });
        res.status(201).json(newVariationOption);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create variation option' });
      }
      break;

    case 'PUT':
      try {
        const { id, name, floorPlanId, isActive } = req.body;
        const updatedVariationOption = await prisma.variationOption.update({
          where: { id },
          data: { name, floorPlanId, isActive },
        });
        res.status(200).json(updatedVariationOption);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update variation option' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await prisma.variationOption.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete variation option' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}