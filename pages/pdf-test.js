import { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

export default function PDFTest() {
  const targetRef = useRef();

  // Configure react-to-pdf
  const { toPDF, targetRef: pdfRef } = usePDF({
    filename: 'overlay-test.pdf',
    page: { margin: 10 }
  });

  // Your 4 PNG images - base floorplan + 3 overlay layers
  const images = [
    '/testimages/0 Standard.png',      // Base floorplan
    '/testimages/Living 1.png',        // Living zone overlay
    '/testimages/Master 1.png',        // Master zone overlay
    '/testimages/Family 1.png'         // Family zone overlay
  ];

  // Alternative: Use existing sample images (remove the comment to use these instead)
  // const images = [
  //   '/uploads/elevation1.png',
  //   '/uploads/elevation2.png',
  //   '/uploads/elevation3.png',
  //   '/logo.png'
  // ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PDF Compiler Test - Image Overlay</h1>

        {/* Control Panel */}
        <div className="mb-6 bg-white p-6 rounded shadow">
          <button
            onClick={() => toPDF()}
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition w-full"
          >
            Generate PDF
          </button>
        </div>

        {/* PDF Content - Image Overlay */}
        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Preview (This will be in the PDF):</h2>

          <div ref={pdfRef} className="border-2 border-gray-300 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Floorplan</h3>

            {/* Overlay Container */}
            <div className="relative w-full" style={{ height: '600px', margin: '0 auto', maxWidth: '800px' }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={index === 0 ? 'Base Floorplan' : `${img.split('/').pop().split('.')[0]} Overlay`}
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{
                    zIndex: index
                  }}
                />
              ))}
            </div>

            {/* Image List */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-2">Layers:</h4>
              <ul className="list-none space-y-1 text-sm text-gray-600">
                {images.map((img, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {index === 0 ? 'BASE' : `LAYER ${index}`}
                    </span>
                    <span>{img.split('/').pop()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Test: Side by Side Comparison */}
        <div className="mt-8 bg-white p-8 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Individual Images:</h2>
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div key={index} className="border rounded p-4">
                <h3 className="text-sm font-semibold mb-2">Image {index + 1}</h3>
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-contain bg-gray-50 rounded"
                />
                <p className="text-xs text-gray-500 mt-2 break-all">{img}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
