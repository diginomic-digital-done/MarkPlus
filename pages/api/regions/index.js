import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const regions = await prisma.region.findMany();
        res.status(200).json(regions);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch regions', details: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, code, isActive, stateId, pdfStaticPages } = req.body;
        if (!name || !code || typeof isActive === 'undefined' || !stateId) {
          return res.status(400).json({ error: 'Missing required fields: name, code, isActive, stateId' });
        }
        const newRegion = await prisma.region.create({
          data: {
            name,
            code,
            isActive,
            state: { connect: { id: parseInt(stateId) } },
            pdfStaticPages: Array.isArray(pdfStaticPages) ? pdfStaticPages : [],
          },
        });
        res.status(201).json(newRegion);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create region', details: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}