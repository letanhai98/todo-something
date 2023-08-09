import userService from '../services/user.service';
import UserModel from '../models/user.model';

const login = async (req, res) => {
  const userData = req.body;

  const { password, ...result } = await userService.login(userData);

  return res.status(200).send({ ok: true, message: 'succeed', data: result });
};

const register = async (req, res) => {
  const userData = req.body || {};
  console.log('userData: ', userData);
  const user = await userService.createUser(userData);

  return res.status(200).json({ data: user });
};

const getUsers = async (req, res) => {
  const { page,limit } = req.query;

  const checkLimit = limit ?? 10;
  
  const users = await userService.getUsers(page,checkLimit);
  const totals = await UserModel.countDocuments();
  const totalPages =  Math.ceil(totals / checkLimit);

  return res.status(200).json({ success: 'ok', data: users || [], totalPages, limit: checkLimit, page, totals });
};

const activate = async (req, res) => {
  const { activateCode, email, password, confirmPassword } = req.body || {};
  const users = await userService.activate(
    email,
    activateCode,
    password,
    confirmPassword
  );

  return res.status(200).json({ success: 'ok', data: users || [] });
};

const sendActivateCode = async (req, res) => {
  const { email } = req.body || {};
  await userService.sendActivateCode(email);

  return res.status(200).json({ success: 'ok', data: {} });
};

const update = async (req, res) => {
  const data = req.body || {};
  const user = req.user || {};
  const result = await userService.update(data, user);

  return res.status(200).json({ success: 'ok', data: result });
};


const sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body || {};

  await userService.sendForgotPasswordCode(email);

  return res.status(202).json({ success: 'ok', data: {} });
};

const checkCode = async (req, res) => {
  const { email, code } = req.body || {};

  const result = await userService.checkCode(email, code);

  return res.status(200).json({ success: 'ok', data: result });
};

const forgotPassword = async (req, res) => {
  const { email, code, newPassword, confirmNewPassword } = req.body || {};

  await userService.forgotPassword(
    email,
    code,
    newPassword,
    confirmNewPassword
  );

  return res.status(202).json({ success: 'ok', data: {} });
};


export default {
  login,
  register,
  getUsers,
  activate,
  sendActivateCode,
  update,
  sendForgotPasswordCode,
  checkCode,
  forgotPassword,
};
