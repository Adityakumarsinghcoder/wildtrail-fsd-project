import express from 'express';
import { getStays, getStayById, createStay, deleteStay } from '../controllers/stayController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStays);
router.get('/:id', getStayById);
router.post('/', protect, adminOnly, createStay);
router.delete('/:id', protect, adminOnly, deleteStay);

export default router;
