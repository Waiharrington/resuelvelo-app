import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId, title, description, photosUrls, location, budget, deadline } = req.body;

    const post = await prisma.post.create({
      data: {
        clientId: req.user!.id,
        categoryId,
        title,
        description,
        photosUrls,
        location,
        budget,
        deadline
      },
      include: {
        category: true,
        client: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Notify nearby providers
    // TODO: Implement push notification logic

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (category) where.categoryId = category;
    if (status) where.status = status;
    else where.status = 'active';

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          client: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true
            }
          },
          offers: {
            select: { id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      success: true,
      data: posts.map(post => ({
        ...post,
        offersCount: post.offers.length,
        offers: undefined
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Error getting posts' });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        client: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            location: true
          }
        },
        offers: {
          include: {
            provider: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, message: 'Error getting post' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, photosUrls, location, budget, deadline, status } = req.body;

    // Check ownership
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost || existingPost.clientId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const post = await prisma.post.update({
      where: { id },
      data: { title, description, photosUrls, location, budget, deadline, status },
      include: {
        category: true,
        client: {
          select: { id: true, fullName: true, avatarUrl: true }
        }
      }
    });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check ownership
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost || existingPost.clientId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      where: { clientId: req.user!.id },
      include: {
        category: true,
        offers: {
          include: {
            provider: {
              select: { id: true, fullName: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ success: false, message: 'Error getting posts' });
  }
};
