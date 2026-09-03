// @ts-nocheck
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const { event, data } = req.body;

    // Verify webhook signature (implementation depends on payment provider)
    // const signature = req.headers['x-webhook-signature'];
    // if (!verifySignature(signature, req.body)) {
    //   return res.status(401).json({ success: false, message: 'Invalid signature' });
    // }

    switch (event) {
      case 'payment.completed':
        await handlePaymentCompleted(data);
        break;
      case 'payment.failed':
        await handlePaymentFailed(data);
        break;
      case 'payment.refunded':
        await handlePaymentRefunded(data);
        break;
      default:
        console.log(`Unknown event: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

const handlePaymentCompleted = async (data: any) => {
  const { transactionId, amount, clientId, providerId } = data;

  // Update transaction status
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'completed' }
  });

  // Update provider wallet
  await prisma.wallet.upsert({
    where: { userId: providerId },
    update: { balance: { increment: amount * 0.85 } }, // 85% to provider
    create: {
      userId: providerId,
      balance: amount * 0.85
    }
  });

  // Update insurance fund (5%)
  await prisma.insuranceFund.upsert({
    where: { id: 'default' },
    update: { balance: { increment: amount * 0.05 } },
    create: {
      id: 'default',
      balance: amount * 0.05
    }
  });

  // Platform commission (10%)
  // This would go to a platform wallet
};

const handlePaymentFailed = async (data: any) => {
  const { transactionId } = data;

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'failed' }
  });
};

const handlePaymentRefunded = async (data: any) => {
  const { transactionId, amount, clientId } = data;

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'refunded' }
  });

  // Refund to client wallet
  await prisma.wallet.upsert({
    where: { userId: clientId },
    update: { balance: { increment: amount } },
    create: {
      userId: clientId,
      balance: amount
    }
  });
};
