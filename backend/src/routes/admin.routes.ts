import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getIncidents,
  resolveIncident
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/verifications', getPendingVerifications);
router.put('/verifications/:id/approve', approveVerification);
router.put('/verifications/:id/reject', rejectVerification);
router.get('/incidents', getIncidents);
router.put('/incidents/:id/resolve', resolveIncident);

export default router;
