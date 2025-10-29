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
    case 'POST':
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'Failed to upload image' });
          return;
        }

        const file = files.file;
        const filePath = `public/images/${file.originalFilename}`;

        fs.renameSync(file.filepath, filePath);

        try {
          const newImage = await prisma.image.create({
            data: {
              name: fields.name,
              filePath,
            },
          });
          res.status(201).json(newImage);
        } catch (error) {
          res.status(500).json({ error: 'Failed to save image' });
        }
      });
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const image = await prisma.image.findUnique({ where: { id } });

        if (image) {
          fs.unlinkSync(image.filePath);
          await prisma.image.delete({ where: { id } });
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Image not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete image' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}