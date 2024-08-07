import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;