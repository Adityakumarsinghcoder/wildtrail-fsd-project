import express from 'express';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
