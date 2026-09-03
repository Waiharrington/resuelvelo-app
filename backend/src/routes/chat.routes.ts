import { Router } from 'express';
import { sendMessage, getConversation, getConversations } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/send', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/:userId', authenticate, getConversation);

export default router;
