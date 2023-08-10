import Router from 'express-promise-router';
import userController from '../controllers/user-controller';
import { authenticate } from '../middlewares/authentication';

const router = new Router();

router.get('/', userController.getUsers);
router.post('/check-code', userController.checkCode);
router.post('/forgot-password', userController.forgotPassword);
router.patch('/', authenticate, userController.update);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/activate', userController.activate);
router.post('/send-code', userController.sendActivateCode);
router.post(
  '/send-code-forgot-password',
  userController.sendForgotPasswordCode
);
router.delete('/delete', userController.deleteUser);

export default router;
