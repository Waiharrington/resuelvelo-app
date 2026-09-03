import { Router } from 'express';
import {
  verifyProvider,
  getProviderVerification,
  getProviderById,
  addReview
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/verify', authenticate, authorize('provider'), verifyProvider);
router.get('/verify', authenticate, authorize('provider'), getProviderVerification);
router.get('/provider/:id', authenticate, getProviderById);
router.post('/review', authenticate, addReview);

export default router;
