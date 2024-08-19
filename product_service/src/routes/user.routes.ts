import { Router } from 'express';
import { authThenToken } from '../utils/authUtils';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/edit/info', authThenToken, UserController.editInformation);
router.put('/edit/avatar', authThenToken, UserController.updateAvatar);
router.put('/edit/bank', authThenToken, UserController.updateBankInfo);
router.put('/edit/address', authThenToken, UserController.updateAddress);

export default router;
