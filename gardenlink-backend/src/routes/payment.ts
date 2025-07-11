import express, { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Single subscription plan configuration
const SUBSCRIPTION_PLAN = {
  name: 'YardConnect Subscription',
  price: 1000, // $10.00 in cents (from the price object you provided)
  features: [
    'Appear in search results',
    'Complete profile with photo',
    'Contact information displayed',
    'Review system access',
    'Direct client contact'
  ],
  stripePriceId: process.env.STRIPE_PRICE_ID || 'price_1RiewjFpxfLRK59KmK7TgdTF'
};

// Validation schemas
const createSubscriptionSchema = z.object({
  plan: z.literal('subscription'), // Only one plan option
});

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string(),
});

// Get current user's subscription
const getMySubscriptionHandler: RequestHandler = async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    res.json(subscription || { status: 'none' });
    return;
  } catch (err) {
    next(err);
  }
};

// Create subscription checkout session
const createSubscriptionHandler: RequestHandler = async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = createSubscriptionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid input', details: result.error.errors });
      return;
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, profile: { select: { name: true } } },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PLAN.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/yardworker/dashboard?success=true`,
      cancel_url: `${req.protocol}://${req.get('host')}/yardworker/dashboard?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId,
        plan: 'subscription',
        yardWorkerName: user.profile?.name || 'Unknown',
      },
    });

    res.json({ sessionId: session.id, url: session.url });
    return;
  } catch (err) {
    console.error('Error creating subscription:', err);
    next(err);
  }
};

// Cancel subscription
const cancelSubscriptionHandler: RequestHandler = async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = cancelSubscriptionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid input', details: result.error.errors });
      return;
    }

    const { subscriptionId } = result.data;

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findFirst({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    // Cancel in Stripe
    if (subscription.stripeId) {
      await stripe.subscriptions.update(subscription.stripeId, {
        cancel_at_period_end: true,
      });
    }

    // Update in database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'cancelled' },
    });

    res.json({ message: 'Subscription cancelled successfully' });
    return;
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    next(err);
  }
};

// Get subscription plan
const getSubscriptionPlansHandler: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    res.json({ subscription: SUBSCRIPTION_PLAN });
    return;
  } catch (err) {
    next(err);
  }
};

// Stripe webhook handler
const stripeWebhookHandler: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      res.status(400).json({ error: 'Missing signature or webhook secret' });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
    return;
  } catch (err) {
    console.error('Webhook error:', err);
    next(err);
  }
};

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { userId, plan, yardWorkerName } = session.metadata || {};
    
    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    // Create or update subscription in database
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: plan || 'subscription',
        status: 'active',
        stripeId: session.subscription as string,
        amount: SUBSCRIPTION_PLAN.price,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      create: {
        userId,
        plan: plan || 'subscription',
        status: 'active',
        stripeId: session.subscription as string,
        amount: SUBSCRIPTION_PLAN.price,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        amount: SUBSCRIPTION_PLAN.price,
        status: 'COMPLETED',
        stripeId: session.payment_intent as string,
        subscriptionId: subscription.id,
      },
    });

    console.log(`Subscription created for user ${userId} (${yardWorkerName})`);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    if (!subscriptionId) {
      console.error('No subscription ID in invoice');
      return;
    }

    // Update subscription in database
    await prisma.subscription.updateMany({
      where: { stripeId: subscriptionId },
      data: {
        status: 'active',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Create payment record
    const subscription = await prisma.subscription.findFirst({
      where: { stripeId: subscriptionId },
    });

    if (subscription) {
      await prisma.payment.create({
        data: {
          userId: subscription.userId,
          amount: invoice.amount_paid,
          status: 'COMPLETED',
          stripeId: invoice.payment_intent as string,
          subscriptionId: subscription.id,
        },
      });
    }

    console.log(`Payment succeeded for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    if (!subscriptionId) {
      console.error('No subscription ID in invoice');
      return;
    }

    // Update subscription status
    await prisma.subscription.updateMany({
      where: { stripeId: subscriptionId },
      data: { status: 'expired' },
    });

    console.log(`Payment failed for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Routes
router.get('/subscription', authenticateToken, getMySubscriptionHandler);
router.post('/subscription', authenticateToken, createSubscriptionHandler);
router.delete('/subscription', authenticateToken, cancelSubscriptionHandler);
router.get('/plans', getSubscriptionPlansHandler);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router; 