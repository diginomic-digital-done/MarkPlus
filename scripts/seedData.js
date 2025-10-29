const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Insert Regions
    const regions = [
      { name: 'Region 1', isActive: true },
      { name: 'Region 2', isActive: true },
      { name: 'Region 3', isActive: false },
    ];

    for (const region of regions) {
      await prisma.region.create({ data: region });
    }

    console.log('Regions seeded successfully');

    // Insert Variation Options
    const variationOptions = [
      {
        floorPlanId: 3, // Ensure this matches an existing FloorPlan ID
        type: 'Option Type 1',
        label: 'Option Label 1',
        description: 'Description for Option 1',
        image: 'option1.jpg',
        priceDelta: 1000,
        isActive: true,
        order: 1,
      },
      {
        floorPlanId: 3,
        type: 'Option Type 2',
        label: 'Option Label 2',
        description: 'Description for Option 2',
        image: 'option2.jpg',
        priceDelta: 2000,
        isActive: true,
        order: 2,
      },
    ];

    for (const option of variationOptions) {
      await prisma.variationOption.create({ data: option });
    }

    console.log('Variation Options seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();