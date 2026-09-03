// @ts-nocheck
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMyTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { clientId: req.user!.id },
          { providerId: req.user!.id }
        ]
      },
      include: {
        post: {
          include: { category: true }
        },
        client: {
          select: { id: true, fullName: true, avatarUrl: true }
        },
        provider: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Error getting transactions' });
  }
};

export const completeTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    // Only client can mark as complete
    if (transaction.clientId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    // Credit provider wallet (amount minus commission)
    const providerAmount = Number(transaction.amount) - Number(transaction.commission);
    await prisma.wallet.update({
      where: { userId: transaction.providerId },
      data: {
        balance: {
          increment: providerAmount
        }
      }
    });

    res.json({ success: true, data: updatedTransaction });
  } catch (error) {
    console.error('Complete transaction error:', error);
    res.status(500).json({ success: false, message: 'Error completing transaction' });
  }
};

export const disputeTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason, evidenceUrls } = req.body;

    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id },
      data: { status: 'disputed' }
    });

    // Create incident
    const incident = await prisma.incident.create({
      data: {
        transactionId: id,
        reporterId: req.user!.id,
        description: reason,
        evidenceUrls,
        status: 'open'
      }
    });

    res.json({ success: true, data: incident });
  } catch (error) {
    console.error('Dispute transaction error:', error);
    res.status(500).json({ success: false, message: 'Error disputing transaction' });
  }
};

export const getWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id }
    });

    res.json({ success: true, data: wallet });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ success: false, message: 'Error getting wallet' });
  }
};
