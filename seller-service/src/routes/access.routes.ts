import { Router } from 'express';
import { AccessController } from '../controllers/access.controller';

const router = Router();

router.post('/verify-token', AccessController.verifyToken);
router.post('/register', AccessController.register);
router.get('/verify-email', AccessController.verifyEmail);
router.post('/login', AccessController.login);
router.post('/token', AccessController.refreshToken);
router.post('/revoke', AccessController.revokeToken);

export default router;
