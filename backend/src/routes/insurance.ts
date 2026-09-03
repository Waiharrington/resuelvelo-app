// @ts-nocheck
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
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
router.post('/claim', authMiddleware, fileInsuranceClaim);
router.get('/claims', authMiddleware, getInsuranceClaims);
router.put('/claims/:claimId', authMiddleware, updateClaimStatus);

export default router;
