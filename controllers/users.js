const { HttpCode } = require("../helpers/constants");
const users = require("../repositories/users");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const UploadService = require("../services/cloud-upload");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const AVATARS_DIR = process.env.AVATARS_DIR;

const signup = async (req, res, next) => {
  try {
    const user = await users.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }

    const { id, email, subscription, avatarUrl } = await users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      message: { id, email, subscription, avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    const { id, email, subscription, avatarUrl } = user;
    const payload = { id, email, subscription };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30h" });
    await users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { token, user: { email, subscription, avatarUrl } },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;

    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    await users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = jwt.decode(req.user.token);
    const { email, subscription, avatarUrl } = user;

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { email, subscription, avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.decode(token);

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    const newUser = await users.updateSubscription(user.id, req.body);
    const { id, email, subscription } = newUser;
    const payload = { id, email, subscription };
    const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "30h" });
    await users.updateToken(id, newToken);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { email, subscription, newToken },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadService();
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );

    await fs.rename(req.file.path, path.join(AVATARS_DIR, req.file.filename));
    await users.updateAvatar(id, avatarUrl, idCloudAvatar);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  updateSubscription,
};
