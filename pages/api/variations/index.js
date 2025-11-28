/**
 * @swagger
 * /api/variations:
 *   get:
 *     summary: Get all variations
 *     responses:
 *       200:
 *         description: List of variations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new variation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneId:
 *                 type: integer
 *               label:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               staffImage:
 *                 type: string
 *               priceDelta:
 *                 type: number
 *               staffPriceDelta:
 *                 type: number
 *               order:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               floorPlanId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Variation created
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.query.id) {
          const variation = await prisma.variation.findUnique({
            where: { id: parseInt(req.query.id) },
            include: { zone: true },
          });
          res.status(200).json(variation);
        } else if (req.query.floorPlanId) {
          const variations = await prisma.variation.findMany({
            where: { floorPlanId: parseInt(req.query.floorPlanId) },
            include: { zone: true },
          });
          res.status(200).json(variations);
        } else {
          const variations = await prisma.variation.findMany({
            include: { zone: true },
          });
          res.status(200).json(variations);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch variations' });
      }
      break;

    case 'POST':
      try {
        if (Array.isArray(req.body)) {
          // Bulk insert
          const createdOptions = [];
          for (const item of req.body) {
            const { zoneId, label, description, image, staffImage, icon, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = item;
            const newVariation = await prisma.variation.create({
              data: {
                zoneId: zoneId ? Number(zoneId) : null,
                label,
                description,
                image,
                staffImage,
                icon,
                priceDelta: priceDelta !== undefined && priceDelta !== null ? parseFloat(priceDelta) : null,
                staffPriceDelta: staffPriceDelta !== undefined && staffPriceDelta !== null ? parseFloat(staffPriceDelta) : null,
                order: order !== undefined && order !== null ? parseInt(order) : null,
                isActive,
                floorPlanId: floorPlanId ? parseInt(floorPlanId) : null,
              },
            });
            createdOptions.push(newVariation);
          }
          res.status(201).json({ message: 'Bulk variations created', createdOptions });
        } else {
          // Single insert (existing logic)
          const { zoneId, label, description, image, staffImage, icon, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = req.body;
          const newVariation = await prisma.variation.create({
            data: {
              zoneId: zoneId ? Number(zoneId) : null,
              label,
              description,
              image,
              staffImage,
              icon,
              priceDelta: priceDelta !== undefined && priceDelta !== null ? parseFloat(priceDelta) : null,
              staffPriceDelta: staffPriceDelta !== undefined && staffPriceDelta !== null ? parseFloat(staffPriceDelta) : null,
              order: order !== undefined && order !== null ? parseInt(order) : null,
              isActive,
              floorPlanId: floorPlanId ? parseInt(floorPlanId) : null,
            },
          });
          res.status(201).json(newVariation);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to create variation' });
      }
      break;

    case 'PUT':
      try {
        const { id, zoneId, label, description, image, staffImage, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = req.body;
        const updatedVariation = await prisma.variation.update({
          where: { id },
          data: {
            zoneId: zoneId ? Number(zoneId) : null,
            label,
            description,
            image,
            staffImage,
            priceDelta: priceDelta !== undefined && priceDelta !== null ? parseFloat(priceDelta) : null,
            staffPriceDelta: staffPriceDelta !== undefined && staffPriceDelta !== null ? parseFloat(staffPriceDelta) : null,
            order: order !== undefined && order !== null ? parseInt(order) : null,
            isActive,
            floorPlanId: floorPlanId ? parseInt(floorPlanId) : null,
          },
        });
        res.status(200).json(updatedVariation);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to update variation' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await prisma.variation.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to delete variation' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
