import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log(`Received ${req.method} request at ${req.url}`); // Debugging log

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        // Fetch a single user by ID
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: { role: true },
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
      } else {
        // Fetch all users
        const users = await prisma.user.findMany({
          include: { role: true },
        });
        res.status(200).json(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { state, roleId, ...data } = req.body;

    try {
      if (!roleId || isNaN(parseInt(roleId))) {
        return res.status(400).json({ error: 'Invalid roleId' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          ...data,
          state,
          roleId: parseInt(roleId),
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('Received data for user creation:', req.body); // Debugging log

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Validate roleId
      if (!req.body.roleId || isNaN(parseInt(req.body.roleId))) {
        return res.status(400).json({ error: 'Invalid role ID' });
      }

      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobile: req.body.mobile,
          state: req.body.state, // Updated to use state
          password: hashedPassword, // Store the hashed password
          role: {
            connect: { id: parseInt(req.body.roleId) },
          },
        },
      });

      console.log('User created successfully:', newUser); // Debugging log
      res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
      console.error('Error creating user:', error); // Detailed error log
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}