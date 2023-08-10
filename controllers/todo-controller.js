import todoService from '../services/todo.service';
import TodoModel from '../models/todo.model';

const createTodo = async (req, res) => {
  const todoData = req.body || {};
  const user = req.user || {};

  const todo = await todoService.createTodo({
    ...todoData,
    createdByUserId: user.userId,
  });

  return res.status(200).json({ data: todo });
};

const getTodos = async (req, res) => {
  const { page, limit } = req.query;

  const checkLimit = limit ?? 10;

  const todos = await todoService.getTodos(page, checkLimit);
  const totals = await TodoModel.countDocuments();
  const totalPages = Math.ceil(totals / checkLimit);

  return res.status(200).json({
    success: 'ok',
    data: todos || [],
    totalPages,
    limit: checkLimit,
    page,
    totals,
  });
};

const getMyTodos = async (req, res) => {
  const { page, limit } = req.query;
  const user = req.user || {};

  const checkLimit = limit ?? 10;

  const todos = await todoService.getMyTodos(page, checkLimit, user?.userId);
  const totals = await TodoModel.countDocuments({
    createdByUserId: user?.userId,
  });
  const totalPages = Math.ceil(totals / checkLimit);

  return res.status(200).json({
    success: 'ok',
    data: todos || [],
    totalPages,
    limit: checkLimit,
    page,
    totals,
  });
};

const getTodo = async (req, res) => {
  const { todoId } = req.query;
  const result = await todoService.getTodoById(todoId);

  return res.status(200).json({ success: 'ok', data: result });
};

const update = async (req, res) => {
  const data = req.body || {};
  const result = await todoService.update(data);

  return res.status(200).json({ success: 'ok', data: result });
};

export default {
  createTodo,
  getTodos,
  update,
  getMyTodos,
  getTodo,
};
