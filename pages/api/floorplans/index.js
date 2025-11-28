import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // No custom CORS middleware needed for Next.js API routes

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const floorPlans = await prisma.floorPlan.findMany();
        res.status(200).json(floorPlans);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch floor plans' });
      }
      break;

    case 'POST':
      try {
        const { id, title, regionId, frontage, areaLiving, areaTotal, basePrice, heroImage, gallery, brochurePdf, floorPlanUrl, status, pdfPagesOverride } = req.body;

        console.log('Received data:', req.body); // Debugging log
        console.log('Parsed data:', {
          id,
          title,
            regionId: parseInt(regionId),
          frontage: parseFloat(frontage),
          areaLiving: parseInt(areaLiving),
          areaTotal: parseInt(areaTotal),
          basePrice: parseFloat(basePrice),
          heroImage,
          gallery,
          brochurePdf,
          floorPlanUrl,
          status,
          pdfPagesOverride,
        });
        console.log('Request body:', req.body); // Log the incoming request body
        console.log('Parsed regionId:', parseInt(req.body.regionId)); // Log the parsed regionId

        if (!regionId || isNaN(parseInt(regionId))) {
          return res.status(400).json({ error: 'Invalid region ID' });
        }

        const newFloorPlan = await prisma.floorPlan.create({
          data: {
            title,
            region: {
              connect: { id: parseInt(regionId) },
            },
            frontage: parseFloat(frontage),
            areaLiving: parseInt(areaLiving),
            areaTotal: parseInt(areaTotal),
            basePrice: parseFloat(basePrice),
            heroImage,
            gallery,
            brochurePdf,
            floorPlanUrl,
            status,
            pdfPagesOverride,
            bedrooms: req.body.bedrooms !== undefined && req.body.bedrooms !== null ? parseInt(req.body.bedrooms) : null,
            bathrooms: req.body.bathrooms !== undefined && req.body.bathrooms !== null ? parseInt(req.body.bathrooms) : null,
            carSpaces: req.body.carSpaces !== undefined && req.body.carSpaces !== null ? parseInt(req.body.carSpaces) : null,
          },
        });

        console.log('Floor Plan created successfully:', newFloorPlan); // Debugging log
        res.status(201).json({ message: 'Floor Plan created successfully', newFloorPlan });
      } catch (error) {
        console.error('Error creating Floor Plan:', error); // Debugging log
        res.status(500).json({ error: 'Failed to create floor plan', details: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, title, regionId, frontage, areaLiving, areaTotal, basePrice, heroImage, gallery, brochurePdf, floorPlanUrl, status, pdfPagesOverride, bedrooms, bathrooms, carSpaces } = req.body;
        const updatedFloorPlan = await prisma.floorPlan.update({
          where: { id },
          data: {
            title,
            regionId: regionId ? parseInt(regionId) : undefined,
            frontage: frontage !== undefined && frontage !== null ? parseFloat(frontage) : undefined,
            areaLiving: areaLiving !== undefined && areaLiving !== null ? parseInt(areaLiving) : undefined,
            areaTotal: areaTotal !== undefined && areaTotal !== null ? parseInt(areaTotal) : undefined,
            basePrice: basePrice !== undefined && basePrice !== null ? parseFloat(basePrice) : undefined,
            heroImage,
            gallery,
            brochurePdf,
            floorPlanUrl,
            status,
            pdfPagesOverride,
            bedrooms: bedrooms !== undefined && bedrooms !== null ? parseInt(bedrooms) : null,
            bathrooms: bathrooms !== undefined && bathrooms !== null ? parseInt(bathrooms) : null,
            carSpaces: carSpaces !== undefined && carSpaces !== null ? parseInt(carSpaces) : null,
          },
        });
        res.status(200).json(updatedFloorPlan);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update floor plan' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await prisma.floorPlan.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete floor plan' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}