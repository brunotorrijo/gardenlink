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

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 2900, // $29.00 in cents
    features: ['Appear in search results', 'Basic profile', 'Email contact'],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_placeholder'
  },
  premium: {
    name: 'Premium Plan',
    price: 5900, // $59.00 in cents
    features: ['Priority placement', 'Enhanced profile', 'Phone contact', 'Featured listing'],
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder'
  },
  featured: {
    name: 'Featured Plan',
    price: 9900, // $99.00 in cents
    features: ['Top placement', 'Full profile', 'All contact methods', 'Analytics dashboard'],
    stripePriceId: process.env.STRIPE_FEATURED_PRICE_ID || 'price_featured_placeholder'
  }
};

// Validation schemas
const createSubscriptionSchema = z.object({
  plan: z.enum(['basic', 'premium', 'featured']),
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

    const { plan } = result.data;
    const planConfig = SUBSCRIPTION_PLANS[plan];

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
          price: planConfig.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/gardener/dashboard?success=true`,
      cancel_url: `${req.protocol}://${req.get('host')}/gardener/dashboard?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId,
        plan,
        gardenerName: user.profile?.name || 'Unknown',
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

// Get subscription plans
const getSubscriptionPlansHandler: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    res.json(SUBSCRIPTION_PLANS);
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
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
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

// Webhook handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];

  // Create subscription in database
  await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      amount: planConfig.price,
      stripeId: subscription.id,
    },
  });

  console.log(`Subscription created for user ${userId}, plan: ${plan}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  // Find subscription in database
  const subscription = await prisma.subscription.findFirst({
    where: { stripeId: subscriptionId },
  });

  if (!subscription) {
    console.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      amount: invoice.amount_paid,
      status: 'COMPLETED',
      stripeId: invoice.payment_intent as string,
      subscriptionId: subscription.id,
    },
  });

  // Update subscription end date
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Extend by 30 days
      status: 'active',
    },
  });

  console.log(`Payment processed for subscription ${subscription.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  // Find subscription in database
  const subscription = await prisma.subscription.findFirst({
    where: { stripeId: subscriptionId },
  });

  if (!subscription) {
    console.error('Subscription not found for failed invoice:', invoice.id);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'expired' },
  });

  console.log(`Payment failed for subscription ${subscription.id}`);
}

// Routes
router.get('/subscription', authenticateToken, getMySubscriptionHandler);
router.post('/subscription', authenticateToken, createSubscriptionHandler);
router.delete('/subscription', authenticateToken, cancelSubscriptionHandler);
router.get('/plans', getSubscriptionPlansHandler);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router; 