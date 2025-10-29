import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { regionId, floorPlanId, variationOptionId } = req.body;

        // Example: Link FloorPlan to Region
        if (regionId && floorPlanId) {
          await prisma.floorPlan.update({
            where: { id: floorPlanId },
            data: { regionId },
          });
        }

        // Example: Link VariationOption to FloorPlan
        if (floorPlanId && variationOptionId) {
          await prisma.variationOption.update({
            where: { id: variationOptionId },
            data: { floorPlanId },
          });
        }

        res.status(200).json({ message: 'Relationships updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update relationships' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}