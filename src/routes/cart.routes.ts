import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem } from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.delete('/remove/:productId', authMiddleware, removeFromCart);
router.put('/update/:productId', authMiddleware, updateCartItem);

export default router;