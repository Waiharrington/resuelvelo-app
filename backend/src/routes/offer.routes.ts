import { Router } from 'express';
import {
  createOffer,
  getOffersForPost,
  acceptOffer,
  withdrawOffer,
  getMyOffers
} from '../controllers/offer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('provider'), createOffer);
router.get('/my-offers', authenticate, getMyOffers);
router.get('/post/:postId', authenticate, getOffersForPost);
router.put('/:id/accept', authenticate, authorize('client'), acceptOffer);
router.put('/:id/withdraw', authenticate, authorize('provider'), withdrawOffer);

export default router;
