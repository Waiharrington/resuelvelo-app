import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId, price, message } = req.body;

    // Check if post exists and is active
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.status !== 'active') {
      res.status(400).json({ success: false, message: 'Post not available' });
      return;
    }

    // Check if already offered
    const existingOffer = await prisma.offer.findFirst({
      where: { postId, providerId: req.user!.id }
    });

    if (existingOffer) {
      res.status(400).json({ success: false, message: 'Already offered on this post' });
      return;
    }

    // Check offers limit (max 5)
    const offerCount = await prisma.offer.count({ where: { postId } });
    if (offerCount >= 5) {
      res.status(400).json({ success: false, message: 'Maximum offers reached' });
      return;
    }

    const offer = await prisma.offer.create({
      data: {
        postId,
        providerId: req.user!.id,
        price,
        message
      },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Notify client
    // TODO: Implement push notification

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ success: false, message: 'Error creating offer' });
  }
};

export const getOffersForPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const offers = await prisma.offer.findMany({
      where: { postId },
      include: {
        provider: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ success: false, message: 'Error getting offers' });
  }
};

export const acceptOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { post: true }
    });

    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    // Check if user is the post owner
    if (offer.post.clientId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Update offer status
    await prisma.offer.update({
      where: { id },
      data: { status: 'accepted' }
    });

    // Reject other offers
    await prisma.offer.updateMany({
      where: {
        postId: offer.postId,
        id: { not: id }
      },
      data: { status: 'rejected' }
    });

    // Close post
    await prisma.post.update({
      where: { id: offer.postId },
      data: { status: 'closed' }
    });

    // Create transaction
    const commission = Number(offer.price) * 0.1; // 10% commission
    const insuranceFee = 3.00; // $3 insurance

    const transaction = await prisma.transaction.create({
      data: {
        postId: offer.postId,
        clientId: offer.post.clientId,
        providerId: offer.providerId,
        amount: Number(offer.price),
        commission,
        insuranceFee,
        status: 'in_progress'
      }
    });

    res.json({ success: true, data: { offer, transaction } });
  } catch (error) {
    console.error('Accept offer error:', error);
    res.status(500).json({ success: false, message: 'Error accepting offer' });
  }
};

export const withdrawOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const offer = await prisma.offer.findUnique({ where: { id } });

    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    if (offer.providerId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await prisma.offer.update({
      where: { id },
      data: { status: 'withdrawn' }
    });

    res.json({ success: true, message: 'Offer withdrawn' });
  } catch (error) {
    console.error('Withdraw offer error:', error);
    res.status(500).json({ success: false, message: 'Error withdrawing offer' });
  }
};

export const getMyOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offers = await prisma.offer.findMany({
      where: { providerId: req.user!.id },
      include: {
        post: {
          include: {
            category: true,
            client: {
              select: { id: true, fullName: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Get my offers error:', error);
    res.status(500).json({ success: false, message: 'Error getting offers' });
  }
};
