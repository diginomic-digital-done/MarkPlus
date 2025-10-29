import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.error('Upload directory error:', err);
    return res.status(500).json({ error: 'Failed to create upload directory', details: err.message });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    multiples: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Formidable parse error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }
    try {
      const uploadedFiles = [];
      for (const key in files) {
        const fileArr = Array.isArray(files[key]) ? files[key] : [files[key]];
        fileArr.forEach(file => {
          uploadedFiles.push({
            url: `/uploads/${path.basename(file.filepath)}`,
            name: file.originalFilename,
          });
        });
      }
      return res.status(200).json({ files: uploadedFiles });
    } catch (e) {
      console.error('File processing error:', e);
      return res.status(500).json({ error: 'Error processing files', details: e.message });
    }
  });
}
