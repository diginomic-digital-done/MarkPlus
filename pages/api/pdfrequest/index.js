import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        triggeredBy,
        userId,
        stateId,
        regionId,
        floorPlanId,
        selectedOptions,
        clientFirstName,
        clientEmail,
        clientPhone,
        longCode,
        sourceUrl
      } = req.body;

      // Basic validation (add more as needed)
      if (!triggeredBy || !stateId || !regionId || !floorPlanId || !selectedOptions || !clientFirstName || !clientEmail || !clientPhone || !longCode) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      const pdfRequest = await prisma.pDFRequest.create({
        data: {
          triggeredBy,
          userId: userId ? Number(userId) : undefined,
          stateId: Number(stateId),
          regionId: Number(regionId),
          floorPlanId: Number(floorPlanId),
          selectedOptions,
          clientFirstName,
          clientEmail,
          clientPhone,
          longCode,
          sourceUrl
        }
      });

      return res.status(201).json(pdfRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Failed to create PDF request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
