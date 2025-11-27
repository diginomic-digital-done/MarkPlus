const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateFloorplanPDF() {
  console.log('Starting PDF generation...');

  // Define image paths
  const baseDir = path.join(__dirname, '..', 'public', 'testimages');
  const images = [
    path.join(baseDir, '0 Standard.png'),
    path.join(baseDir, 'Living 1.png'),
    path.join(baseDir, 'Master 1.png'),
    path.join(baseDir, 'Family 1.png')
  ];

  // Check if all images exist
  console.log('Checking for images...');
  for (const imgPath of images) {
    if (!fs.existsSync(imgPath)) {
      console.error(`ERROR: Image not found: ${imgPath}`);
      console.error('Please add your PNG files to /public/testimages/ directory');
      process.exit(1);
    }
    console.log(`✓ Found: ${path.basename(imgPath)}`);
  }

  try {
    // Load the base image to get dimensions
    console.log('\nLoading base image...');
    const baseImage = sharp(images[0]);
    const metadata = await baseImage.metadata();
    const { width, height } = metadata;
    console.log(`Base image dimensions: ${width}x${height}`);

    // Create composite array - overlays will be stacked on top of base
    console.log('\nCompositing layers...');
    const compositeArray = [];

    // Add each overlay (skip first as it's the base)
    for (let i = 1; i < images.length; i++) {
      console.log(`Adding layer ${i}: ${path.basename(images[i])}`);
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

    console.log('✓ Image compositing complete');

    // Create PDF
    console.log('\nCreating PDF...');
    const outputPath = path.join(__dirname, '..', 'public', 'pdfs', 'floorplan-output.pdf');

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: [width, height],
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    // Pipe to file
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Add the composited image to PDF
    doc.image(compositedImage, 0, 0, {
      width: width,
      height: height
    });

    // Finalize PDF
    doc.end();

    // Wait for write to complete
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    console.log(`✓ PDF generated successfully!`);
    console.log(`\nOutput location: ${outputPath}`);
    console.log(`\nYou can also access it at: http://localhost:3000/pdfs/floorplan-output.pdf`);

  } catch (error) {
    console.error('\nERROR generating PDF:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the function
generateFloorplanPDF();
