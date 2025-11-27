# PDF Compiler Testing Guide

This guide explains how to test the PDF compiler functionality with react-to-pdf.

## Setup Complete ✓

- ✅ `react-to-pdf` package installed
- ✅ Test page created at `/pages/pdf-test.js`
- ✅ Test images directory created at `/public/test-images/`

## How to Add Your Images

### Option 1: Using the test-images directory (Recommended)

1. Navigate to `/public/test-images/` in your project
2. Add your 4 PNG files and name them:
   - `layer1.png`
   - `layer2.png`
   - `layer3.png`
   - `layer4.png`

### Option 2: Use custom paths

If you want to use different image names or locations:

1. Place your images anywhere in the `/public/` directory
2. Edit `/pages/pdf-test.js` and update the `images` array with your paths:

```javascript
const images = [
  '/your-folder/your-image1.png',
  '/your-folder/your-image2.png',
  '/your-folder/your-image3.png',
  '/your-folder/your-image4.png'
];
```

### Option 3: Use existing sample images

The project already has sample images in `/public/uploads/`. To use these:

1. Edit `/pages/pdf-test.js`
2. Uncomment the alternative images array (lines 21-27)
3. Comment out the test-images array

## How to Test

### Step 1: Start the development server

```bash
npm run dev
```

### Step 2: Open the test page

Navigate to: `http://localhost:3000/pdf-test`

### Step 3: Verify the overlay

You should see:
- Your 4 images overlaid on top of each other
- A preview section showing the overlay
- Individual images displayed below

### Step 4: Generate PDF

Click the **"Generate PDF"** button. The browser will download a file named `overlay-test.pdf`.

## Customization Options

### Adjust Opacity

In `/pages/pdf-test.js`, find the overlay section and modify the `opacity` value:

```javascript
style={{
  opacity: 0.7, // Change this value (0.0 to 1.0)
  zIndex: index
}}
```

### Change PDF Filename

Update the `filename` in the `usePDF` configuration:

```javascript
const { toPDF, targetRef: pdfRef } = usePDF({
  filename: 'your-custom-name.pdf',
  page: { margin: 10 }
});
```

### Adjust Page Size and Margins

Modify the `page` configuration:

```javascript
const { toPDF, targetRef: pdfRef } = usePDF({
  filename: 'overlay-test.pdf',
  page: {
    margin: 20,           // Increase margin
    format: 'a4',         // Paper size: 'a4', 'letter', etc.
    orientation: 'landscape' // 'portrait' or 'landscape'
  }
});
```

### Change Overlay Size

Update the container dimensions in the JSX:

```javascript
<div className="relative w-full" style={{ height: '600px', maxWidth: '800px' }}>
  {/* images */}
</div>
```

## Advanced: Different Overlay Techniques

### Full Opacity (Solid Layers)

Remove or set `opacity: 1.0` to make images fully opaque. Only the top layer will be visible.

### Blend Modes

Add CSS blend modes for creative effects:

```javascript
style={{
  opacity: 0.7,
  zIndex: index,
  mixBlendMode: 'multiply' // or 'overlay', 'screen', etc.
}}
```

### Positioned Layers

Position images at specific locations instead of full overlay:

```javascript
style={{
  position: 'absolute',
  top: `${index * 50}px`,  // Offset each layer
  left: `${index * 50}px`,
  width: '400px',
  height: '400px'
}}
```

## Troubleshooting

### Images not showing

1. Check that images are in the correct directory
2. Verify file names match exactly (case-sensitive)
3. Ensure images are PNG format
4. Check browser console for 404 errors

### PDF not generating

1. Check browser console for errors
2. Ensure the `pdfRef` is attached to the correct div
3. Try clicking the button again

### PDF looks different from preview

This is normal - the PDF rendering may differ slightly from browser rendering. Adjust margins and sizing as needed.

## Next Steps

Once you're happy with the test:

1. Integrate this functionality into your main application
2. Connect it to your backend API if needed
3. Add user upload functionality for dynamic images
4. Customize styling to match your brand

## Package Documentation

For more advanced usage, check the official docs:
- [react-to-pdf on NPM](https://www.npmjs.com/package/react-to-pdf)

## Questions?

The test page includes inline instructions and examples. Experiment with the code to learn more!
