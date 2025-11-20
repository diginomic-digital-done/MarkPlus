import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const floorPlan = await prisma.floorPlan.findUnique({
          where: { id: parseInt(id) },
        });
        if (!floorPlan) {
          return res.status(404).json({ error: 'Floor plan not found' });
        }
        res.status(200).json(floorPlan);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch floor plan' });
      }
      break;

    case 'PUT':
      try {
        const {
          title,
          regionId,
          frontage,
          areaLiving,
          areaTotal,
          basePrice,
          heroImage,
          gallery,
          brochurePdf,
          floorPlanUrl,
          status,
          pdfPagesOverride,
          bedrooms,
          bathrooms,
          carSpaces,
        } = req.body;

        // Ensure correct types and handle empty arrays
        const updateData = {
          title,
          regionId: regionId ? parseInt(regionId) : undefined,
          frontage: frontage !== undefined && frontage !== null ? Number(frontage) : undefined,
          areaLiving: areaLiving !== undefined && areaLiving !== null ? Number(areaLiving) : undefined,
          areaTotal: areaTotal !== undefined && areaTotal !== null ? Number(areaTotal) : undefined,
          basePrice: basePrice !== undefined && basePrice !== null ? Number(basePrice) : undefined,
          heroImage,
          gallery: Array.isArray(gallery) ? gallery : [],
          brochurePdf,
          floorPlanUrl,
          status,
          pdfPagesOverride: Array.isArray(pdfPagesOverride) ? pdfPagesOverride : [],
          bedrooms: bedrooms !== undefined && bedrooms !== null ? parseInt(bedrooms) : null,
          bathrooms: bathrooms !== undefined && bathrooms !== null ? parseInt(bathrooms) : null,
          carSpaces: carSpaces !== undefined && carSpaces !== null ? parseInt(carSpaces) : null,
        };

        const updatedFloorPlan = await prisma.floorPlan.update({
          where: { id: parseInt(id) },
          data: updateData,
        });
        res.status(200).json(updatedFloorPlan);
      } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update floor plan', details: error.message });
      }
      break; 
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}