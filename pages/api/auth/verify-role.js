import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    if (!email) {
      console.error('Email is missing in the request body');
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Request received for email:', email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('User fetched from database:', user);
    console.log('Role ID:', user ? user.roleId : 'User not found');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAdmin = user.roleId === 1; // Check if roleId corresponds to admin
    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('Error verifying role:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}