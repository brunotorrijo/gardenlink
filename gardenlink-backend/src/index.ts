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
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 