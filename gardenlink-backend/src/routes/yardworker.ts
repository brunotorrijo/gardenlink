import express, { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticateToken, AuthRequest as BaseAuthRequest } from '../middleware/auth';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { supabaseAdmin } from '../supabase';

const router = express.Router();

// Extend AuthRequest to include file property for multer
interface AuthRequestWithFile extends BaseAuthRequest {
  file?: Express.Multer.File;
}

// Multer setup for photo uploads (memory storage for Supabase)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation schemas
const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  age: z.number().min(16, 'Must be at least 16 years old').max(100),
  price: z.number().min(0, 'Price must be positive'),
  email: z.string().email('Invalid email format'),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be less than 500 characters'),
  photo: z.string().url('Invalid photo URL').optional(),
});

const updateProfileSchema = createProfileSchema.partial();

// Zod schema for creating a review
const createReviewSchema = z.object({
  profileId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// Nodemailer setup (production: use SendGrid SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., 'smtp.sendgrid.net'
  port: Number(process.env.SMTP_PORT) || 587, // 587 is standard for TLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // e.g., 'apikey' for SendGrid
    pass: process.env.SMTP_PASS, // your SendGrid API key
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000, // 5 seconds
  socketTimeout: 10000, // 10 seconds
});

// Verify transporter connection on startup
transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

// Helper function to send emails with better error handling
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"YardConnect" <yardconnect.test@gmail.com>',
      to,
      subject,
      html,
    });
    console.log('📧 Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

// Get current user's yard worker profile
const getMyProfileHandler = async (req: AuthRequestWithFile, res: Response, next: express.NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const profile = await prisma.yardWorkerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            subscription: {
              select: {
                status: true,
                plan: true,
                amount: true
              }
            }
          },
        },
        services: true,
        reviews: true,
      },
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Add profile publishing status
    const isPublished = profile.user.subscription?.status === 'active';
    const profileWithStatus = {
      ...profile,
      isPublished,
      subscriptionStatus: profile.user.subscription?.status || 'none',
      subscriptionPlan: profile.user.subscription?.plan || null,
      subscriptionAmount: profile.user.subscription?.amount || null
    };

    res.json(profileWithStatus);
    return;
  } catch (err) {
    next(err);
  }
};

// Create or update yard worker profile
const createOrUpdateProfileHandler = async (req: AuthRequestWithFile, res: Response, next: express.NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = createProfileSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ 
        error: 'Invalid input', 
        details: result.error.errors 
      });
      return;
    }

    const profileData = result.data;

    // Check if profile already exists
    const existingProfile = await prisma.yardWorkerProfile.findUnique({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.yardWorkerProfile.update({
        where: { userId },
        data: {
          name: profileData.name,
          location: profileData.location,
          zip: profileData.zip,
          age: profileData.age,
          price: profileData.price,
          email: profileData.email,
          bio: profileData.bio,
          photo: profileData.photo,
          services: {
            connectOrCreate: profileData.services.map((serviceName: string) => ({
              where: { name: serviceName },
              create: { name: serviceName },
            })),
          },
        },
        include: {
          user: {
            select: {
              email: true,
              role: true,
            },
          },
          services: true,
          reviews: true,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.yardWorkerProfile.create({
        data: {
          userId,
          name: profileData.name,
          location: profileData.location,
          zip: profileData.zip,
          age: profileData.age,
          price: profileData.price,
          email: profileData.email,
          bio: profileData.bio,
          photo: profileData.photo,
          services: {
            connectOrCreate: profileData.services.map((serviceName: string) => ({
              where: { name: serviceName },
              create: { name: serviceName },
            })),
          },
        },
        include: {
          user: {
            select: {
              email: true,
              role: true,
            },
          },
          services: true,
          reviews: true,
        },
      });
    }

    res.status(existingProfile ? 200 : 201).json(profile);
    return;
  } catch (err) {
    next(err);
  }
};

// Get public yard worker profile by ID
const getPublicProfileHandler = async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const profile = await prisma.yardWorkerProfile.findUnique({
      where: { id },
      include: {
        services: true,
        reviews: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ error: 'Yard worker profile not found' });
      return;
    }

    // Calculate average rating
    const avgRating = profile.reviews && profile.reviews.length > 0
      ? profile.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / profile.reviews.length
      : 0;

    const publicProfile = {
      ...profile,
      averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
    };

    res.json(publicProfile);
    return;
  } catch (err) {
    next(err);
  }
};

// Get all yard worker profiles (for search) - Only show profiles from yard workers with active subscriptions
const getAllProfilesHandler = async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
  try {
    const { location, service, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;

    // Build where clause for filtering
    const where: any = {
      // Only show profiles from users with active subscriptions
      user: {
        subscription: {
          status: 'active'
        }
      }
    };
    
    if (location) {
      where.OR = [
        { location: { contains: location as string, mode: 'insensitive' } },
        { zip: { contains: location as string, mode: 'insensitive' } },
      ];
    }

    if (service) {
      where.services = {
        some: {
          name: { contains: service as string, mode: 'insensitive' },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const profiles = await prisma.yardWorkerProfile.findMany({
      where,
      include: {
        services: true,
        reviews: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate average ratings
    const profilesWithRatings = profiles.map(profile => {
      const avgRating = profile.reviews && profile.reviews.length > 0
        ? profile.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / profile.reviews.length
        : 0;

      return {
        ...profile,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined, // Remove individual reviews from response
      };
    });

    res.json(profilesWithRatings);
    return;
  } catch (err) {
    next(err);
  }
};

// Upload profile photo endpoint
router.post('/profile/photo', authenticateToken, upload.single('photo'), async (req: AuthRequestWithFile, res: Response, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Upload to Supabase Storage
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${userId}_${Date.now()}${fileExt}`;
    const filePath = `yardworker_photos/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('photos')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      res.status(500).json({ error: 'Failed to upload photo' });
      return;
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('photos')
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // Update profile with new photo URL
    await prisma.yardWorkerProfile.update({
      where: { userId },
      data: { photo: photoUrl },
    });

    res.json({ photo: photoUrl });
    return;
  } catch (err) {
    console.error('Photo upload error:', err);
    next(err);
  }
});

// POST /api/reviews - Create a review
router.post('/reviews', authenticateToken, async (req: AuthRequestWithFile, res: Response, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const result = createReviewSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid input', details: result.error.errors });
      return;
    }
    const { profileId, rating, comment } = result.data;
    // Prevent duplicate reviews by same user for same profile
    const existing = await prisma.review.findFirst({ where: { profileId, userId } });
    if (existing) {
      res.status(409).json({ error: 'You have already reviewed this yard worker.' });
      return;
    }
    const review = await prisma.review.create({
      data: { profileId, userId, rating, comment },
      include: {
        user: { select: { id: true, email: true } },
      },
    });
    res.status(201).json(review);
    return;
  } catch (err) {
    next(err);
  }
});

// GET /api/yardworkers/:id/reviews - Get reviews for a yard worker
router.get('/:id/reviews', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { profileId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true } },
      },
      take: 20,
    });
    res.json(reviews);
    return;
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews/pending - Public review submission (email verification)
router.post('/reviews/pending', async (req, res, next) => {
  try {
    const { profileId, email, rating, comment } = req.body;
    
    // Enhanced validation
    if (!profileId || !email || !rating) {
      res.status(400).json({ error: 'Missing required fields: profileId, email, and rating are required' });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }
    
    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
      return;
    }
    
    // Check if profile exists
    const profile = await prisma.yardWorkerProfile.findUnique({
      where: { id: profileId },
      select: { id: true, name: true }
    });
    
    if (!profile) {
      res.status(404).json({ error: 'Yard worker profile not found' });
      return;
    }
    
    // Prevent duplicate pending reviews for same email/profile
    const existing = await prisma.pendingReview.findFirst({ 
      where: { profileId, email, verifiedAt: null } 
    });
    
    if (existing) {
      res.status(409).json({ error: 'A review from this email is already pending verification. Please check your inbox.' });
      return;
    }
    
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Create pending review
    await prisma.pendingReview.create({
      data: { 
        profileId, 
        email, 
        rating: ratingNum, 
        comment: comment || '', 
        token 
      },
    });
    
    console.log(`📝 Pending review created for ${profile.name} (${profileId}) from ${email}`);
    
    // Send verification email
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const verifyUrl = `${baseUrl}/api/yardworkers/reviews/verify/${token}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">YardConnect Review Verification</h2>
        <p>Thank you for leaving a review for <strong>${profile.name}</strong>!</p>
        <p>To verify and publish your review, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify & Publish Review
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can copy and paste this link into your browser:<br>
          <a href="${verifyUrl}" style="color: #059669;">${verifyUrl}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link will expire once used. If you didn't submit a review, you can safely ignore this email.
        </p>
      </div>
    `;
    
    await sendEmail(
      email, 
      `Verify your review for ${profile.name} - YardConnect`, 
      emailHtml
    );
    
    console.log(`📧 Verification email sent to ${email} for review of ${profile.name}`);
    
    res.json({ 
      message: 'Verification email sent successfully! Please check your inbox and click the verification link to publish your review.',
      yardWorkerName: profile.name
    });
    return;
  } catch (err) {
    console.error('❌ Error in review submission:', err);
    next(err);
  }
});

// GET /api/yardworkers/reviews/verify/:token - Verify and publish review
router.get('/reviews/verify/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    
    console.log(`🔍 Verifying review token: ${token}`);
    
    const pending = await prisma.pendingReview.findUnique({ 
      where: { token }
    });
    
    if (!pending) {
      console.log(`❌ Invalid token: ${token}`);
      res.status(404).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #dc2626;">Invalid Review Link</h2>
          <p>This verification link is invalid or has expired.</p>
          <p>Please submit your review again from the yard worker's profile page.</p>
        </div>
      `);
      return;
    }
    
    if (pending.verifiedAt) {
      console.log(`❌ Already verified token: ${token}`);
      res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #dc2626;">Review Already Verified</h2>
          <p>This review has already been verified and published.</p>
          <p>Thank you for your contribution!</p>
        </div>
      `);
      return;
    }
    
    // Get profile name for display
    const profile = await prisma.yardWorkerProfile.findUnique({
      where: { id: pending.profileId },
      select: { name: true }
    });
    
    // Publish review
    await prisma.review.create({
      data: {
        profileId: pending.profileId,
        rating: pending.rating,
        comment: pending.comment,
        userId: null,
      },
    });
    
    await prisma.pendingReview.update({ 
      where: { token }, 
      data: { verifiedAt: new Date() } 
    });
    
    console.log(`✅ Review published for ${profile?.name || 'Unknown'} (${pending.profileId}) from ${pending.email}`);
    
    res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="color: #059669; font-size: 48px; margin-bottom: 20px;">✅</div>
        <h2 style="color: #059669; margin-bottom: 20px;">Review Published Successfully!</h2>
        <p style="font-size: 18px; margin-bottom: 30px;">
          Thank you for your review of <strong>${profile?.name || 'this yard worker'}</strong>!
        </p>
        <p style="color: #666; margin-bottom: 30px;">
          Your review has been verified and is now live on YardConnect. 
          Other users will be able to see your feedback when browsing yard workers.
        </p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
          <p style="margin: 0; color: #065f46;">
            <strong>Rating:</strong> ${'⭐'.repeat(pending.rating)}<br>
            ${pending.comment ? `<strong>Comment:</strong> "${pending.comment}"` : ''}
          </p>
        </div>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          You can close this window now.
        </p>
      </div>
    `);
    return;
  } catch (err) {
    console.error('❌ Error in review verification:', err);
    next(err);
  }
});

// Routes
router.get('/profile', authenticateToken, getMyProfileHandler);
router.post('/profile', authenticateToken, createOrUpdateProfileHandler);
router.put('/profile', authenticateToken, createOrUpdateProfileHandler);
router.get('/:id', getPublicProfileHandler);
router.get('/', getAllProfilesHandler);

export default router; 