import express from 'express';
import { getAllUsers } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

export default router;