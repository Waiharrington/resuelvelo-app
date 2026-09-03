// @ts-nocheck
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalClients,
      totalPosts,
      totalTransactions,
      totalRevenue,
      pendingVerifications,
      openIncidents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userType: 'provider' } }),
      prisma.user.count({ where: { userType: 'client' } }),
      prisma.post.count(),
      prisma.transaction.count(),
      prisma.transaction.aggregate({ _sum: { commission: true } }),
      prisma.providerVerification.count({ where: { verificationStatus: 'pending' } }),
      prisma.incident.count({ where: { status: 'open' } })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalClients,
        totalPosts,
        totalTransactions,
        totalRevenue: totalRevenue._sum.commission || 0,
        pendingVerifications,
        openIncidents
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error getting dashboard' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, userType, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (userType) where.userType = userType;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          userType: true,
          avatarUrl: true,
          isVerified: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error getting users' });
  }
};

export const getPendingVerifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const verifications = await prisma.providerVerification.findMany({
      where: { verificationStatus: 'pending' },
      include: {
        provider: {
          select: {
            id: true,
            email: true,
            phone: true,
            fullName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: verifications });
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({ success: false, message: 'Error getting verifications' });
  }
};

export const approveVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const verification = await prisma.providerVerification.update({
      where: { id },
      data: {
        verificationStatus: 'approved',
        verifiedAt: new Date()
      }
    });

    // Mark provider as verified
    await prisma.user.update({
      where: { id: verification.providerId },
      data: { isVerified: true }
    });

    res.json({ success: true, data: verification });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ success: false, message: 'Error approving verification' });
  }
};

export const rejectVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const verification = await prisma.providerVerification.update({
      where: { id },
      data: { verificationStatus: 'rejected' }
    });

    res.json({ success: true, data: verification });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ success: false, message: 'Error rejecting verification' });
  }
};

export const getIncidents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        transaction: true,
        reporter: {
          select: { id: true, fullName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: incidents });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ success: false, message: 'Error getting incidents' });
  }
};

export const resolveIncident = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { resolution, action } = req.body;

    const incident = await prisma.incident.findUnique({ where: { id } });

    if (!incident) {
      res.status(404).json({ success: false, message: 'Incident not found' });
      return;
    }

    await prisma.incident.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution
      }
    });

    // Handle based on action
    if (action === 'refund') {
      await prisma.transaction.update({
        where: { id: incident.transactionId },
        data: { status: 'refunded' }
      });
    } else if (action === 'release') {
      await prisma.transaction.update({
        where: { id: incident.transactionId },
        data: { status: 'completed', completedAt: new Date() }
      });
    }

    res.json({ success: true, message: 'Incident resolved' });
  } catch (error) {
    console.error('Resolve incident error:', error);
    res.status(500).json({ success: false, message: 'Error resolving incident' });
  }
};
