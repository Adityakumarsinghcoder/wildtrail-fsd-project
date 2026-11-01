import express from 'express';
import { getAdventures, getAdventureById, createAdventure, deleteAdventure } from '../controllers/adventureController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAdventures);
router.get('/:id', getAdventureById);
router.post('/', protect, adminOnly, createAdventure);
router.delete('/:id', protect, adminOnly, deleteAdventure);

export default router;
