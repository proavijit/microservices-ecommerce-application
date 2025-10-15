// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';




dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});



// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4001;
const serviceName = process.env.SERVICE_NAME || 'Product Service';

app.listen(PORT, () => {
  console.log(`${serviceName} is running on port ${PORT}`);
});
