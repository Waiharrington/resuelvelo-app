// @ts-nocheck
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getInsuranceFund,
  fileInsuranceClaim,
  getInsuranceClaims,
  updateClaimStatus
} from '../controllers/insuranceController';

const router = Router();

// Public routes
router.get('/fund', getInsuranceFund);

// Protected routes
router.post('/claim', authenticate, fileInsuranceClaim);
router.get('/claims', authenticate, getInsuranceClaims);
router.put('/claims/:claimId', authenticate, updateClaimStatus);

export default router;
