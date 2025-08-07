import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from './prisma';
import authRouter from './routes/auth';
import yardworkerRouter from './routes/yardworker';
import paymentRouter from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// IMPORTANT: Webhook route must be before JSON middleware
// This ensures the raw body is preserved for Stripe signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'YardConnect API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      yardworkers: '/api/yardworkers',
      payments: '/api/payments'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'YardConnect backend is running!' });
});

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRouter);
app.use('/api/yardworkers', yardworkerRouter);
app.use('/api/payments', paymentRouter);

// Add webhook handler after other routes
app.post('/api/payments/webhook', async (req, res, next) => {
  // Import the webhook handler function directly
  const { stripeWebhookHandler } = await import('./routes/payment');
  await stripeWebhookHandler(req, res, next);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 