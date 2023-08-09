
import {
  BAD_REQUEST,
  createError,
} from '../common/error-utils';
import TodoModel from '../models/todo.model';

const createTodo = async ({ name, description, point, createdByUserId }) => {
  const savedTodo = await TodoModel.findOne({ name });
  if (savedTodo) {
    throw createError(BAD_REQUEST, 'name todo already exist');
  }

  const todo = await TodoModel.create({
    name, description, point, createdByUserId
  });

  return todo;
};

const getTodos = async (page,limit) => {
  const skip = (page - 1) * limit;

  return TodoModel.find({

  }).skip(skip)
       .limit(limit)
};

const getMyTodos = async (page,limit, userId) => {
  const skip = (page - 1) * limit;

  return TodoModel.find({
    createdByUserId: userId,
  }).skip(skip)
       .limit(limit)
};

const update = async (data) => {
  const { name, description, point, isDone, todoId } =
    data;

    const savedTodo = await TodoModel.findById(todoId);

    if(!savedTodo) {
      throw createError(BAD_REQUEST, 'todo not found');
    }

  const todoToBeUpdated = {};

  if (name) {
    todoToBeUpdated.name = name;
  }

  if (description) {
    todoToBeUpdated.description = description;
  }

  if (point) {
    todoToBeUpdated.point = point;
  }

  if (isDone) {
    todoToBeUpdated.point = isDone;
  }

  return  TodoModel.findByIdAndUpdate({ _id: todoId }, todoToBeUpdated, {
    new: true,
  });
};

export default {
  createTodo,
  getTodos,
  getMyTodos,
  update,
};
