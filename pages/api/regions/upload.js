
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload error', details: err.message });
    }
    let uploadedFiles = files.file;
    if (!Array.isArray(uploadedFiles)) uploadedFiles = [uploadedFiles];
    const fileUrls = uploadedFiles.map((file) => {
      const fileName = path.basename(file.filepath);
      return `/pdfs/${fileName}`;
    });
    res.status(200).json({ urls: fileUrls });
  });
}
