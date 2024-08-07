import express from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getProductReviews);

export default router;