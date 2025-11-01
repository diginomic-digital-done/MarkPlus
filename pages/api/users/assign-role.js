import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '../../../utils/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, role } = req.body;

  try {
    // Verify if the requester is an admin
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate input
    if (!userId || !role) {
      return res.status(400).json({ error: 'User ID and role are required' });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.status(200).json({ message: 'Role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}