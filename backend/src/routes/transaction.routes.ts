import { Router } from 'express';
import {
  getMyTransactions,
  completeTransaction,
  disputeTransaction,
  getWallet
} from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-transactions', authenticate, getMyTransactions);
router.get('/wallet', authenticate, getWallet);
router.put('/:id/complete', authenticate, completeTransaction);
router.put('/:id/dispute', authenticate, disputeTransaction);

export default router;
