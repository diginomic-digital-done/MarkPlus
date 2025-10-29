import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const user = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json(user);
    } catch (error) {
      console.error('Error deleting user:', error); // Log detailed error
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; // Handle already-parsed body

      // Hash the password if it is provided
      const updatedData = { ...data };
      if (data.password) {
        updatedData.password = await bcrypt.hash(data.password, 10);
      }

      // Validate the fields to be updated
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });

      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user:', error); // Detailed error log
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}