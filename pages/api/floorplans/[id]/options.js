import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { type },
    method,
    url,
  } = req;
  const {
    id
  } = req.query;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id || !type) {
    return res.status(400).json({ error: 'Missing floorplan id or type' });
  }

  try {
    // Fetch variation options for the given floorplan and type
    const options = await prisma.variationOption.findMany({
      where: {
        floorPlanId: Number(id),
        variationType: {
          label: {
            equals: type,
            mode: 'insensitive'
          }
        }
      },
      include: {
        variationType: true
      }
    });
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
