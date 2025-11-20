const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'Administrator' },
      update: {},
      create: { name: 'Administrator' },
    }),
    prisma.role.upsert({
      where: { name: 'Staff' },
      update: {},
      create: { name: 'Staff' },
    }),
  ]);
  console.log(`${roles.length} roles ensured.`);

  // Seed users with roles
  const adminRole = await prisma.role.findUnique({ where: { name: 'Administrator' } });
  const staffRole = await prisma.role.findUnique({ where: { name: 'Staff' } });

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: await bcrypt.hash('securepassword', 10),
      },
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: await bcrypt.hash('securepassword', 10),
        mobile: '1234567890',
        state: 'New South Wales',
        roleId: adminRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'staff@example.com' },
      update: {
        password: await bcrypt.hash('securepassword', 10),
      },
      create: {
        firstName: 'Staff',
        lastName: 'User',
        email: 'staff@example.com',
        password: await bcrypt.hash('securepassword', 10),
        mobile: '0987654321',
        state: 'Victoria',
        roleId: staffRole.id,
      },
    }),
  ]);
  console.log(`${users.length} users ensured.`);

  // Seed initial VariationTypes
  const types = [
    { name: 'ELEVATION', label: 'Elevation', isActive: true },
    { name: 'LIVING_AREA', label: 'Living Area', isActive: true },
    { name: 'MASTER_SUITE', label: 'Master Suite', isActive: true },
    { name: 'FAMILY_WING', label: 'Family Wing', isActive: true }
  ];

  async function seedVariationTypes() {
    for (const type of types) {
      await prisma.variationType.upsert({
        where: { name: type.name },
        update: type,
        create: type
      });
    }
    console.log('Variation types seeded.');
  }

  return seedVariationTypes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });