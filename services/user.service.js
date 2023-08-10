import {
  BAD_REQUEST,
  createError,
  FORBIDDEN,
  NOT_FOUND,
} from '../common/error-utils';
import mailLibs from '../libs/email';
import { generateToken } from '../middlewares/authentication';
import UserModel from '../models/user.model';

function generate8DigitCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

const login = async ({ email, password }) => {
  const savedUser = await UserModel.findOne({ email });
  if (!savedUser) {
    throw createError(NOT_FOUND, 'user not found');
  }
  // if (!savedUser.isActivated) {
  //   throw createError(
  //     FORBIDDEN,
  //     'your user not active. please activate first'
  //   );
  // }

  const isPasswordValid = await savedUser.verifyPassword(password);
  if (!isPasswordValid) {
    throw createError(200, 'email or password not match');
  }

  const accessToken = generateToken({
    userId: savedUser._id.toString(),
    isRegister: true,
  });

  return { ...savedUser._doc, accessToken };
};

const createUser = async ({
  email,
  password,
  confirmPassword,
  avatar,
  gender,
  isHasGF,
  age,
  userName,
}) => {
  if (password !== confirmPassword) {
    throw createError(BAD_REQUEST, 'Password must be match confirm password');
  }

  const savedUser = await UserModel.findOne({ email });
  if (savedUser) {
    throw createError(BAD_REQUEST, 'email already exist');
  }

  const user = await UserModel.create({
    email,
    password,
    avatar,
    gender,
    isHasGF,
    age,
    userName,
  });

  return user;
};

const getUsers = async (page, limit) => {
  const skip = (page - 1) * limit;

  return UserModel.find().skip(skip).limit(limit);
};

const updateUser = async (user, updateBody) => {
  if (user) {
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }
  return null;
};

const activate = async (email, code, password, confirmPassword) => {
  if (!code) {
    throw createError(BAD_REQUEST, 'code not found');
  }

  if (!password) {
    throw createError(BAD_REQUEST, 'password not found');
  }

  if (password !== confirmPassword) {
    throw createError(BAD_REQUEST, 'Password must be match confirm password');
  }

  if (!password) {
    throw createError(BAD_REQUEST, 'password not found');
  }

  if (!confirmPassword) {
    throw createError(BAD_REQUEST, 'confirm password not found');
  }

  if (password !== confirmPassword) {
    throw createError(BAD_REQUEST, 'Password must be match confirm password');
  }

  const savedUser = await UserModel.findOne({ email });

  if (!savedUser) {
    throw createError(NOT_FOUND, 'user not found');
  }

  if (savedUser.isActivated) {
    throw createError(BAD_REQUEST, 'user already activated');
  }

  if (!(savedUser.lastActivateCode.toString() === code)) {
    throw createError(BAD_REQUEST, 'code not match');
  }

  const hashPassword = await savedUser.hashPassword(password);

  const updated = await UserModel.findByIdAndUpdate(
    savedUser._id,
    { isActivated: true, password: hashPassword },
    { new: true }
  );

  const accessToken = generateToken({
    userId: savedUser._id.toString(),
    isRegister: true,
  });

  return { ...updated._doc, accessToken };
};

const sendActivateCode = async (email) => {
  const savedUser = await UserModel.findOne({ email });
  if (savedUser && savedUser.isActivated) {
    throw createError(BAD_REQUEST, 'user already activated');
  }

  const lastActivateCode = generate8DigitCode();

  const user = await UserModel.updateOne(
    { email },
    {
      lastActivateCode,
    },
    { upsert: true }
  );

  await mailLibs.sendActivateCode(email, lastActivateCode);

  return user;
};

const update = async (data, decodedUser) => {
  const { newPassword, oldPassword, userName, avatar, gender } = data;
  const savedUser = await UserModel.findOne({ _id: decodedUser.userId });

  const userToBeUpdated = {};

  if (newPassword && oldPassword) {
    const isPasswordValid = await savedUser.verifyPassword(oldPassword);

    if (!isPasswordValid) {
      throw createError(BAD_REQUEST, 'current password not match');
    }

    userToBeUpdated.password = newPassword;
  }

  if (avatar) {
    userToBeUpdated.avatar = avatar;
  }

  if (userName) {
    userToBeUpdated.userName = userName;
  }

  if (avatar) {
    userToBeUpdated.avatar = avatar;
  }

  if (gender) {
    userToBeUpdated.gender = gender;
  }

  return UserModel.updateOne({ _id: decodedUser.userId }, userToBeUpdated, {
    new: true,
  });
};

const sendForgotPasswordCode = async (email) => {
  const savedUser = await UserModel.findOne({ email });
  if (!savedUser) {
    throw createError(NOT_FOUND, 'email not found');
  }

  // if (!savedUser.isActivated) {
  //   throw createError(
  //     FORBIDDEN,
  //     'your account not active. please activate first'
  //   );
  // }

  const lastActivateCode = generate8DigitCode();
  console.log('lastActivateCode: ', lastActivateCode);

  const res = await UserModel.findOneAndUpdate(
    { email },
    {
      lastActivateCode: Number(lastActivateCode),
    },
    { upsert: true }
  );

  console.log('res: ', res);

  await mailLibs.sendResetPassword(email, lastActivateCode);
};

const checkCode = async (email, code) => {
  const savedUser = await UserModel.findOne({ email });

  if (!savedUser) {
    throw createError(NOT_FOUND, 'email not found');
  }

  return savedUser.lastActivateCode.toString() === code;
};

const forgotPassword = async (email, code, newPassword, confirmNewPassword) => {
  const savedUser = await UserModel.findOne({ email });
  console.log('savedUser: ', savedUser);

  if (!savedUser) {
    throw createError(NOT_FOUND, 'email not found');
  }

  // if (!savedUser.isActivated) {
  //   throw createError(
  //     FORBIDDEN,
  //     'your account not active. please activate first'
  //   );
  // }

  if (!(savedUser.lastActivateCode.toString() === code)) {
    throw createError(BAD_REQUEST, 'code not match');
  }

  if (newPassword !== confirmNewPassword) {
    throw createError(200, 'New password must be match confirm new password');
  }

  const hashPassword = await savedUser.hashPassword(newPassword);

  const updated = await UserModel.findOne(
    savedUser._id,
    { password: hashPassword },
    { upsert: true }
  );

  return updated;
};

const deleteUser = async (email) => {
  return UserModel.findOneAndDelete({
    email,
  });
};

export default {
  login,
  createUser,
  getUsers,
  updateUser,
  activate,
  sendActivateCode,
  update,
  checkCode,
  sendForgotPasswordCode,
  forgotPassword,
  deleteUser,
};
