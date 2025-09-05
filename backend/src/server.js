import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';

dotenv.config();
const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') { app.use(morgan('dev')); }

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => { res.json({ status: 'ok' }); });

app.use(notFound);
app.use(errorHandler);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log('Server listening on port ' + PORT); });
