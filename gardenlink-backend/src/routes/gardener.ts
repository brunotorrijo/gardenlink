import express from 'express';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../prisma';

const router = express.Router();

const profileSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  zip: z.string().min(3),
  age: z.number().int().min(16),
  price: z.number().int().min(0),
  email: z.string().email(),
  bio: z.string().min(5),
  photo: z.string().url().optional(),
  services: z.array(z.string().uuid()), // expects array of ServiceCategory IDs
});

// Get the logged-in gardener's profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const profile = await prisma.gardenerProfile.findUnique({
    where: { userId },
    include: { services: true },
  });
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  res.json(profile);
});

// Create a new profile
router.post('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const result = profileSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.errors });
    return;
  }
  const data = result.data;
  try {
    const existing = await prisma.gardenerProfile.findUnique({ where: { userId } });
    if (existing) {
      res.status(409).json({ error: 'Profile already exists' });
      return;
    }
    const profile = await prisma.gardenerProfile.create({
      data: {
        ...data,
        userId: userId,
        services: { connect: data.services.map((id: string) => ({ id })) },
      },
      include: { services: true },
    });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const result = profileSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.errors });
    return;
  }
  const data = result.data;
  try {
    const profile = await prisma.gardenerProfile.update({
      where: { userId },
      data: {
        ...data,
        services: { set: [], connect: data.services.map((id: string) => ({ id })) },
      },
      include: { services: true },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete profile
router.delete('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    await prisma.gardenerProfile.delete({ where: { userId } });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 