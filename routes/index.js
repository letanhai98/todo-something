import Router from 'express-promise-router';
import userRoutes from './user.route';
import todoRoutes from './todo.route';

const router = new Router();

router.use('/users', userRoutes);
router.use('/todo', todoRoutes);

export default router;
