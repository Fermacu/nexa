import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'express-async-errors'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NEXA API is running' })
})

// API routes will go here
// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/companies', companyRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: { message: 'Route not found' } 
  })
})

// Error handler (must be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})

export default app