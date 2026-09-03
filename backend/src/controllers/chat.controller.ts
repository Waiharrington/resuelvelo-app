import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.id,
        receiverId,
        content
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    // Emit via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const roomId = [req.user!.id, receiverId].sort().join('-');
      io.to(roomId).emit('new_message', message);
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user!.id, receiverId: userId },
          { senderId: userId, receiverId: req.user!.id }
        ]
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: req.user!.id,
        read: false
      },
      data: { read: true }
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: 'Error getting conversation' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get all unique users this user has chatted with
    const sentMessages = await prisma.message.findMany({
      where: { senderId: req.user!.id },
      select: { receiverId: true }
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: req.user!.id },
      select: { senderId: true }
    });

    const userIds = new Set([
      ...sentMessages.map(m => m.receiverId),
      ...receivedMessages.map(m => m.senderId)
    ]);

    const conversations = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: req.user!.id, receiverId: userId },
              { senderId: userId, receiverId: req.user!.id }
            ]
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { id: true, fullName: true, avatarUrl: true }
            }
          }
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: userId,
            receiverId: req.user!.id,
            read: false
          }
        });

        return {
          user: lastMessage?.sender.id === userId
            ? lastMessage.sender
            : await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, fullName: true, avatarUrl: true }
              }),
          lastMessage,
          unreadCount
        };
      })
    );

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Error getting conversations' });
  }
};
