import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create State
  const state = await prisma.state.upsert({
    where: { code: 'NSW' },
    update: {},
    create: {
      name: 'New South Wales',
      code: 'NSW',
      isActive: true,
    },
  });

  // Create Region linked to State
  const region = await prisma.region.upsert({
    where: { code: 'SYD' },
    update: {},
    create: {
      name: 'Sydney',
      code: 'SYD',
      isActive: true,
      pdfStaticPages: '',
      state: { connect: { id: state.id } },
    },
  });

  // Create FloorPlan linked to Region
  const floorPlan = await prisma.floorPlan.upsert({
    where: { title: 'Sample Floor Plan' },
    update: {},
    create: {
      title: 'Sample Floor Plan',
      region: { connect: { id: region.id } },
      frontage: 10.5,
      areaLiving: 120,
      areaTotal: 150,
      basePrice: 350000,
      heroImage: '',
      gallery: [],
      brochurePdf: '',
      floorPlanUrl: '',
      status: 'Active',
      pdfPagesOverride: [],
    },
  });

  console.log('Seeded State:', state);
  console.log('Seeded Region:', region);
  console.log('Seeded FloorPlan:', floorPlan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
