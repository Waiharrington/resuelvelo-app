// @ts-nocheck
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const getInsuranceFund = async (req: Request, res: Response) => {
  try {
    const fund = await prisma.insuranceFund.findUnique({
      where: { id: 'default' }
    });

    if (!fund) {
      return res.json({
        success: true,
        data: {
          balance: 0,
          totalClaims: 0,
          totalPayouts: 0
        }
      });
    }

    res.json({
      success: true,
      data: fund
    });
  } catch (error) {
    console.error('Error getting insurance fund:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener fondo de seguros'
    });
  }
};

export const fileInsuranceClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId, reason, amount, evidence } = req.body;
    const userId = req.user?.id;

    // Verify transaction exists and user is involved
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { client: true, provider: true }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    if (transaction.clientId !== userId && transaction.providerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Check if claim already exists for this transaction
    const existingClaim = await prisma.incident.findFirst({
      where: {
        transactionId,
        type: 'insurance_claim'
      }
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un reclamo para esta transacción'
      });
    }

    // Create incident/claim
    const claim = await prisma.incident.create({
      data: {
        transactionId,
        reporterId: userId!,
        type: 'insurance_claim',
        description: reason,
        status: 'pending',
        evidence: evidence || []
      }
    });

    res.json({
      success: true,
      data: claim
    });
  } catch (error) {
    console.error('Error filing insurance claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error al presentar reclamo'
    });
  }
};

export const getInsuranceClaims = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userType = req.user?.userType;

    let claims;

    if (userType === 'admin') {
      // Admin can see all claims
      claims = await prisma.incident.findMany({
        where: { type: 'insurance_claim' },
        include: {
          transaction: true,
          reporter: {
            select: { id: true, fullName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Regular users can only see their own claims
      claims = await prisma.incident.findMany({
        where: {
          type: 'insurance_claim',
          reporterId: userId
        },
        include: {
          transaction: true,
          reporter: {
            select: { id: true, fullName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({
      success: true,
      data: claims
    });
  } catch (error) {
    console.error('Error getting insurance claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reclamos'
    });
  }
};

export const updateClaimStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { claimId } = req.params;
    const { status, resolution } = req.body;
    const userType = req.user?.userType;

    if (userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden actualizar reclamos'
      });
    }

    const claim = await prisma.incident.update({
      where: { id: claimId },
      data: {
        status,
        resolution
      }
    });

    // If approved, process payout from insurance fund
    if (status === 'resolved' && resolution === 'approved') {
      const transaction = await prisma.transaction.findUnique({
        where: { id: claim.transactionId }
      });

      if (transaction) {
        // Deduct from insurance fund and refund to affected party
        await prisma.insuranceFund.update({
          where: { id: 'default' },
          data: { balance: { decrement: transaction.amount } }
        });

        // Refund to client
        await prisma.wallet.upsert({
          where: { userId: transaction.clientId },
          update: { balance: { increment: transaction.amount } },
          create: {
            userId: transaction.clientId,
            balance: transaction.amount
          }
        });
      }
    }

    res.json({
      success: true,
      data: claim
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar reclamo'
    });
  }
};
