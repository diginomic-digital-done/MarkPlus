import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const pdfs = await prisma.pdfRequest.findMany();
        res.status(200).json(pdfs);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PDFs' });
      }
      break;

    case 'POST':
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'Failed to upload PDF' });
          return;
        }

        const file = files.file;
        const filePath = `public/pdfs/${file.originalFilename}`;

        fs.renameSync(file.filepath, filePath);

        try {
          const newPDF = await prisma.pdfRequest.create({
            data: {
              name: fields.name,
              filePath,
            },
          });
          res.status(201).json(newPDF);
        } catch (error) {
          res.status(500).json({ error: 'Failed to save PDF' });
        }
      });
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const pdf = await prisma.pdfRequest.findUnique({ where: { id } });

        if (pdf) {
          fs.unlinkSync(pdf.filePath);
          await prisma.pdfRequest.delete({ where: { id } });
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'PDF not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete PDF' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}