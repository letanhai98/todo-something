import Router from 'express-promise-router';
import todoController from '../controllers/todo-controller';
import { authenticate } from '../middlewares/authentication';

const router = new Router();

router.get('/', authenticate, todoController.getTodos);
router.get('/my-todos', authenticate, todoController.getMyTodos);
router.get('/detail', authenticate, todoController.getTodo);
router.post('/create', authenticate, todoController.createTodo);
router.patch('/update', authenticate, todoController.update);
router.delete('/delete', authenticate, todoController.deleteTodo);

export default router;
