import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'; // Assuming you're using Prisma

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    console.log('Request received with email:', email);

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Input Password:', password);
    console.log('Stored Hash:', user.password);
    console.log('Plain Password:', password);
    console.log('Hash from DB:', user.password);

    console.log('Comparing password:', password);
    console.log('Comparing hash:', user.password);
    console.log('bcrypt.compare function called');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password Comparison Result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful
    res.status(200).json({ email: user.email, role: user.role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}