// scripts/seedFloorplans.js
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/floorplans';

const floorplans = [
  // Perth (regionId: 1)
  {
    title: 'Perth Home 2', regionId: '1', basePrice: '410000', bedrooms: '3', bathrooms: '2', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '170', areaTotal: '210', frontage: '10', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Perth Home 3', regionId: '1', basePrice: '420000', bedrooms: '5', bathrooms: '3', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '200', areaTotal: '250', frontage: '12', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Perth Home 4', regionId: '1', basePrice: '430000', bedrooms: '4', bathrooms: '2', carSpaces: '1', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '160', areaTotal: '200', frontage: '11', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Perth Home 5', regionId: '1', basePrice: '440000', bedrooms: '3', bathrooms: '2', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '150', areaTotal: '190', frontage: '13', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Perth Home 6', regionId: '1', basePrice: '450000', bedrooms: '4', bathrooms: '3', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '190', areaTotal: '230', frontage: '14', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  // Adelaide (regionId: 2)
  {
    title: 'Adelaide Home 2', regionId: '2', basePrice: '415000', bedrooms: '3', bathrooms: '2', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '175', areaTotal: '215', frontage: '10', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Adelaide Home 3', regionId: '2', basePrice: '425000', bedrooms: '4', bathrooms: '2', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '185', areaTotal: '225', frontage: '12', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Adelaide Home 4', regionId: '2', basePrice: '435000', bedrooms: '5', bathrooms: '3', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '195', areaTotal: '235', frontage: '11', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Adelaide Home 5', regionId: '2', basePrice: '445000', bedrooms: '4', bathrooms: '2', carSpaces: '1', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '165', areaTotal: '205', frontage: '13', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  },
  {
    title: 'Adelaide Home 6', regionId: '2', basePrice: '455000', bedrooms: '3', bathrooms: '2', carSpaces: '2', status: 'Active', heroImage: '/placeholder.png', gallery: ['/placeholder.png'], areaLiving: '155', areaTotal: '195', frontage: '14', brochurePdf: '/placeholder.pdf', floorPlanUrl: '', pdfPagesOverride: ['/placeholder.pdf']
  }
];

async function seed() {
  for (const fp of floorplans) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fp)
      });
      const data = await res.json();
      console.log(`Inserted: ${fp.title}`, data);
    } catch (err) {
      console.error(`Error inserting ${fp.title}:`, err);
    }
  }
}

seed();
