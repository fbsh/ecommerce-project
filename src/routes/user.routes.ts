import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this protected route', userId: req.userId });
});

export default router;