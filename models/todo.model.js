import mongoose from 'mongoose';

const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    name: String,
    description: String,
    point: {
      type: Number,
      default: 10,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    createdByUserId: String,
  },
  { timestamps: true }
);

const Todo = mongoose.model('todo', todoSchema);

export default Todo;
