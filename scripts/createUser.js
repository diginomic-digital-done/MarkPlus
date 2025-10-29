const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser() {
  const email = 'newuser@example.com'; // Replace with desired email
  const plainPassword = 'newsecurepassword'; // Replace with desired password
  const firstName = 'NewUser'; // Added firstName field
  const lastName = 'UserLastName'; // Added lastName field
  const mobile = '1234567890'; // Added mobile field
  const state = 'DefaultState'; // Added state field
  const roleId = 1; // Added roleId field

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName, // Include firstName field
        lastName, // Include lastName field
        mobile, // Include mobile field
        state, // Include state field
        roleId, // Include roleId field
      },
    });

    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();