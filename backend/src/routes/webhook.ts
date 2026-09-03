// @ts-nocheck
import { Router } from 'express';
import { paymentWebhook } from '../controllers/webhookController';

const router = Router();

// Webhook endpoint - no auth required (verified by signature)
router.post('/payment', paymentWebhook);

export default router;
