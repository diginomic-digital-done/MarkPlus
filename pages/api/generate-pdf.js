const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API: Starting PDF generation...');

    // Define image paths
    const baseDir = path.join(process.cwd(), 'public', 'testimages');
    const images = [
      path.join(baseDir, '0 Standard.png'),
      path.join(baseDir, 'Living 1.png'),
      path.join(baseDir, 'Master 1.png'),
      path.join(baseDir, 'Family 1.png')
    ];

    // Check if all images exist
    for (const imgPath of images) {
      if (!fs.existsSync(imgPath)) {
        return res.status(400).json({
          error: `Image not found: ${path.basename(imgPath)}`
        });
      }
    }

    // Load the base image to get dimensions
    const baseImage = sharp(images[0]);
    const metadata = await baseImage.metadata();
    const { width, height } = metadata;

    console.log(`API: Base image dimensions: ${width}x${height}`);

    // Create composite array
    const compositeArray = [];
    for (let i = 1; i < images.length; i++) {
      compositeArray.push({
        input: images[i],
        top: 0,
        left: 0
      });
    }

    // Composite all images together
    const compositedImage = await baseImage
      .composite(compositeArray)
      .png()
      .toBuffer();

    console.log('API: Image compositing complete');

    // Create PDF in memory
    const chunks = [];
    const doc = new PDFDocument({
      size: [width, height],
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    // Collect PDF data
    doc.on('data', (chunk) => chunks.push(chunk));

    // Wait for PDF to finish
    const pdfPromise = new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // Add the composited image to PDF
    doc.image(compositedImage, 0, 0, {
      width: width,
      height: height
    });

    doc.end();

    const pdfBuffer = await pdfPromise;

    console.log('API: PDF generated successfully');

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=floorplan.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
