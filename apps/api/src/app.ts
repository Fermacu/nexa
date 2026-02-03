import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { companyRoutes } from './routes/companies';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NEXA API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
