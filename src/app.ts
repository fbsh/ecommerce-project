import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/review.routes';
import cartRoutes from './routes/cart.routes';
import favoriteRoutes from './routes/favorites.routes'; 
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';


dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);


// Serve index.html for the root route and any other unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;