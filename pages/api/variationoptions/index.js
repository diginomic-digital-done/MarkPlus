/**
 * @swagger
 * /api/variationoptions:
 *   get:
 *     summary: Get all variation options
 *     responses:
 *       200:
 *         description: List of variation options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new variation option
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variationTypeId:
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
 *         description: Variation option created
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (req.query.id) {
          const variationOption = await prisma.variationOption.findUnique({
            where: { id: parseInt(req.query.id) },
            include: { variationType: true },
          });
          res.status(200).json(variationOption);
        } else if (req.query.floorPlanId) {
          const variationOptions = await prisma.variationOption.findMany({
            where: { floorPlanId: parseInt(req.query.floorPlanId) },
            include: { variationType: true },
          });
          res.status(200).json(variationOptions);
        } else {
          const variationOptions = await prisma.variationOption.findMany({
            include: { variationType: true },
          });
          res.status(200).json(variationOptions);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch variation options' });
      }
      break;

    case 'POST':
      try {
        if (Array.isArray(req.body)) {
          // Bulk insert
          const createdOptions = [];
          for (const item of req.body) {
            const { variationTypeId, label, description, image, staffImage, icon, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = item;
            const newVariationOption = await prisma.variationOption.create({
              data: {
                variationTypeId: variationTypeId ? Number(variationTypeId) : null,
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
            createdOptions.push(newVariationOption);
          }
          res.status(201).json({ message: 'Bulk variation options created', createdOptions });
        } else {
          // Single insert (existing logic)
          const { variationTypeId, label, description, image, staffImage, icon, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = req.body;
          const newVariationOption = await prisma.variationOption.create({
            data: {
              variationTypeId: variationTypeId ? Number(variationTypeId) : null,
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
          res.status(201).json(newVariationOption);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to create variation option' });
      }
      break;

    case 'PUT':
      try {
        const { id, variationTypeId, label, description, image, staffImage, priceDelta, staffPriceDelta, order, isActive, floorPlanId } = req.body;
        const updatedVariationOption = await prisma.variationOption.update({
          where: { id },
          data: {
            variationTypeId: variationTypeId ? Number(variationTypeId) : null,
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
        res.status(200).json(updatedVariationOption);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to update variation option' });
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
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to delete variation option' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}