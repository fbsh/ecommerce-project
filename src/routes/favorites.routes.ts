import express from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favorites.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getFavorites);
router.post('/:productId', authMiddleware, toggleFavorite);

export default router;