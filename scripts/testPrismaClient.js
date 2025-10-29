const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testInsertFloorPlan() {
  try {
    const newFloorPlan = await prisma.floorPlan.create({
      data: {
        title: 'Test Floor Plan',
        stateId: 1,
        frontage: 10.5,
        areaLiving: 120,
        areaTotal: 150,
        basePrice: 250000,
        heroImage: 'hero.jpg',
        gallery: ['gallery1.jpg', 'gallery2.jpg'],
        brochurePdf: 'brochure.pdf',
        floorPlanUrl: 'http://example.com/floorplan',
        status: 'Active',
        pdfPagesOverride: ['page1.pdf', 'page2.pdf'],
      },
    });
    console.log('Inserted Floor Plan:', newFloorPlan);
  } catch (error) {
    console.error('Error inserting Floor Plan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInsertFloorPlan();