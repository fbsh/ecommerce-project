import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  searchProducts, 
  getBrands,
  getCategories
} from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = express.Router();

// Public routes
router.get('/brands', getBrands);
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/details/:id', getProductById);  // Make sure this route is public

// Protected routes (require authentication)
router.use(authMiddleware);

// Admin only routes
router.post('/', adminMiddleware, createProduct);
router.put('/:id', adminMiddleware, updateProduct);
router.delete('/:id', adminMiddleware, deleteProduct);

export default router;