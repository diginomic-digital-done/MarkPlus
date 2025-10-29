const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertState() {
  try {
    const newState = await prisma.state.create({
      data: {
        name: 'Test State',
        code: 'TS',
        isActive: true,
      },
    });
    console.log('Inserted State:', newState);
  } catch (error) {
    console.error('Error inserting State:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertState();