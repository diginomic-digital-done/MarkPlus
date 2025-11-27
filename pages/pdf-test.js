import { useRef, useState } from 'react';

export default function PDFTest() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'floorplan.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

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
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>

        {/* PDF Content - Image Overlay */}
        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Preview:</h2>

          <div style={{ border: '2px solid #d1d5db', padding: '32px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#000000' }}>Complete Floorplan</h3>

            {/* Overlay Container */}
            <div style={{ position: 'relative', width: '100%', height: '600px', margin: '0 auto', maxWidth: '800px' }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={index === 0 ? 'Base Floorplan' : `${img.split('/').pop().split('.')[0]} Overlay`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: index
                  }}
                />
              ))}
            </div>

            {/* Image List */}
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#000000' }}>Layers:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {images.map((img, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#000000' }}>
                      {index === 0 ? 'BASE' : `LAYER ${index}`}
                    </span>
                    <span style={{ color: '#000000' }}>{img.split('/').pop()}</span>
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
