// @ts-nocheck
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const getInsuranceFund = async (req: Request, res: Response) => {
  try {
    const charges = await prisma.insuranceFund.aggregate({
      where: { type: 'charge' },
      _sum: { amount: true }
    });

    const payouts = await prisma.insuranceFund.aggregate({
      where: { type: 'payout' },
      _sum: { amount: true }
    });

    const totalCharges = Number(charges._sum.amount || 0);
    const totalPayouts = Number(payouts._sum.amount || 0);

    res.json({
      success: true,
      data: {
        balance: totalCharges - totalPayouts,
        totalCharges,
        totalPayouts
      }
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
    const { transactionId, reason, evidence } = req.body;
    const userId = req.user?.id;

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

    const existingClaim = await prisma.incident.findFirst({
      where: { transactionId }
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un reclamo para esta transacción'
      });
    }

    const claim = await prisma.incident.create({
      data: {
        transactionId,
        reporterId: userId!,
        description: reason,
        status: 'open',
        evidenceUrls: evidence || []
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
      claims = await prisma.incident.findMany({
        include: {
          transaction: true,
          reporter: {
            select: { id: true, fullName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      claims = await prisma.incident.findMany({
        where: { reporterId: userId },
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
      data: { status, resolution }
    });

    if (status === 'resolved' && resolution === 'approved') {
      const transaction = await prisma.transaction.findUnique({
        where: { id: claim.transactionId }
      });

      if (transaction) {
        await prisma.insuranceFund.create({
          data: {
            userId: transaction.clientId,
            amount: transaction.amount,
            type: 'payout',
            description: `Payout for claim ${claimId}`
          }
        });

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
