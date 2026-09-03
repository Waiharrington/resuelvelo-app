// @ts-nocheck
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const verifyProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      idDocumentUrl,
      proofOfAddressUrl,
      references,
      criminalRecordUrl,
      psychologicalTestScore
    } = req.body;

    const existingVerification = await prisma.providerVerification.findUnique({
      where: { providerId: req.user!.id }
    });

    if (existingVerification) {
      res.status(400).json({ success: false, message: 'Verification already submitted' });
      return;
    }

    const verification = await prisma.providerVerification.create({
      data: {
        providerId: req.user!.id,
        idDocumentUrl,
        proofOfAddressUrl,
        references,
        criminalRecordUrl,
        psychologicalTestScore
      }
    });

    res.status(201).json({ success: true, data: verification });
  } catch (error) {
    console.error('Verify provider error:', error);
    res.status(500).json({ success: false, message: 'Error submitting verification' });
  }
};

export const getProviderVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const verification = await prisma.providerVerification.findUnique({
      where: { providerId: req.user!.id }
    });

    res.json({ success: true, data: verification });
  } catch (error) {
    console.error('Get verification error:', error);
    res.status(500).json({ success: false, message: 'Error getting verification' });
  }
};

export const getProviderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const provider = await prisma.user.findUnique({
      where: { id, userType: 'provider' },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider not found' });
      return;
    }

    // Get verification status
    const verification = await prisma.providerVerification.findUnique({
      where: { providerId: id },
      select: { verificationStatus: true, verifiedAt: true }
    });

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: { revieweeId: id },
      include: {
        reviewer: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        ...provider,
        verification,
        reviews,
        stats: {
          totalReviews: reviews.length,
          averageRating: avgRating
        }
      }
    });
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({ success: false, message: 'Error getting provider' });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { transactionId, rating, comment } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    // Check if user is part of this transaction
    if (transaction.clientId !== req.user!.id && transaction.providerId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findUnique({
      where: { transactionId }
    });

    if (existingReview) {
      res.status(400).json({ success: false, message: 'Already reviewed' });
      return;
    }

    // Determine reviewee
    const revieweeId = transaction.clientId === req.user!.id
      ? transaction.providerId
      : transaction.clientId;

    const review = await prisma.review.create({
      data: {
        transactionId,
        reviewerId: req.user!.id,
        revieweeId,
        rating,
        comment
      },
      include: {
        reviewer: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Error adding review' });
  }
};
